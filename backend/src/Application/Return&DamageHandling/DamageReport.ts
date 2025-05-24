import { Request, Response } from 'express';
import DamageReport from '../../Infrastructure/schemas/damageReport';
import Inventory from '../../Infrastructure/schemas/InventoryManagement';
import Supplier from '../../Infrastructure/schemas/suppliers';
import { sendReturnReportEmail } from '../../Infrastructure/services/emailService';

interface DamageReportInput {
    itemName: string;
    quantity: number;
    damageType: string;
    actionRequired: string;
    supplierName?: string;
    description: string;
    date: string;
    reportedBy: string;
    productName: string;
    brandName: string;
}

// Create a damage report
export const createDamageReport = async (req: Request<{}, {}, DamageReportInput>, res: Response): Promise<void> => {
    try {
        const { itemName, quantity, damageType, actionRequired, supplierName, description, date, reportedBy, productName, brandName } = req.body;

        if (!itemName || !quantity || !damageType || !actionRequired || !description || !date || !reportedBy || !productName || !brandName) {
            res.status(400).json({ message: 'All required fields must be provided' });
            return;
        }

        const inventoryItem = await Inventory.findOne({ productName, brandName });
        if (!inventoryItem) {
            res.status(404).json({ message: 'Item not found in inventory' });
            return;
        }
        if (inventoryItem.quantity < quantity) {
            res.status(400).json({ message: 'Insufficient quantity in inventory' });
            return;
        }

        const newDamageReport = await DamageReport.create({
            itemName,
            quantity,
            damageType,
            actionRequired,
            supplierName,
            description,
            date,
            reportedBy,
        });

        inventoryItem.quantity -= quantity;
        await inventoryItem.save();

        res.status(201).json({ message: 'Damage report created successfully', data: newDamageReport });
    } catch (error: unknown) {
        console.error('Error in createDamageReport:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// Get all damage reports
export const getAllDamageReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const damageReports = await DamageReport.find();
        const enrichedReports = await Promise.all(
            damageReports.map(async (report) => {
                const supplier = report.supplierName
                    ? await Supplier.findOne({ name: report.supplierName })
                    : null;
                return {
                    ...report.toObject(),
                    id: report.id.toString(),
                    supplierEmail: supplier ? supplier.email : 'N/A',
                };
            })
        );
        res.status(200).json(enrichedReports);
    } catch (error: unknown) {
        console.error('Error in getAllDamageReports:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// Update a damage report
export const updateDamageReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { itemName, quantity, damageType, actionRequired, supplierName, description, date, reportedBy, productName, brandName } = req.body;

        if (!id) {
            res.status(400).json({ message: 'Damage report ID is required' });
            return;
        }

        const damageReport = await DamageReport.findById(id);
        if (!damageReport) {
            res.status(404).json({ message: 'Damage report not found' });
            return;
        }

        // Validate inventory if quantity changes
        if (quantity !== damageReport.quantity) {
            const inventoryItem = await Inventory.findOne({ productName, brandName });
            if (!inventoryItem) {
                res.status(404).json({ message: 'Item not found in inventory' });
                return;
            }

            // Adjust inventory quantity: revert the old quantity and apply the new one
            inventoryItem.quantity += damageReport.quantity; // Revert previous deduction
            if (inventoryItem.quantity < quantity) {
                res.status(400).json({ message: 'Insufficient quantity in inventory' });
                return;
            }
            inventoryItem.quantity -= quantity; // Apply new quantity
            await inventoryItem.save();
        }

        // Update the damage report
        const updatedDamageReport = await DamageReport.findByIdAndUpdate(
            id,
            {
                itemName,
                quantity,
                damageType,
                actionRequired,
                supplierName,
                description,
                date,
                reportedBy,
            },
            { new: true }
        );

        res.status(200).json({ message: 'Damage report updated successfully', data: updatedDamageReport });
    } catch (error: unknown) {
        console.error('Error in updateDamageReport:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// Delete a damage report
export const deleteDamageReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Damage report ID is required' });
            return;
        }

        const damageReport = await DamageReport.findById(id);
        if (!damageReport) {
            res.status(404).json({ message: 'Damage report not found' });
            return;
        }

        // Revert inventory quantity
        const [productName, brandName] = damageReport.itemName.split(' (');
        const cleanedBrandName = brandName ? brandName.replace(')', '') : '';
        const inventoryItem = await Inventory.findOne({ productName, brandName: cleanedBrandName });
        if (inventoryItem) {
            inventoryItem.quantity += damageReport.quantity;
            await inventoryItem.save();
        }

        await DamageReport.findByIdAndDelete(id);
        res.status(200).json({ message: 'Damage report deleted successfully' });
    } catch (error: unknown) {
        console.error('Error in deleteDamageReport:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// Send return report email
export const sendReturnReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { damageReportId, additionalDetails } = req.body;

        if (!damageReportId || !additionalDetails) {
            res.status(400).json({ message: 'Damage report ID and additional details are required' });
            return;
        }

        const damageReport = await DamageReport.findById(damageReportId);
        if (!damageReport) {
            res.status(404).json({ message: 'Damage report not found' });
            return;
        }

        const supplier = damageReport.supplierName
            ? await Supplier.findOne({ name: damageReport.supplierName })
            : null;
        if (!supplier || !supplier.email) {
            res.status(404).json({ message: 'Supplier email not found' });
            return;
        }

        await sendReturnReportEmail(
            supplier.email,
            `Return Report for ${damageReport.itemName}`,
            damageReport,
            additionalDetails
        );

        res.status(200).json({ message: 'Return report email sent successfully' });
    } catch (error: unknown) {
        console.error('Error in sendReturnReport:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// Get all inventory items for dropdown
export const getInventoryItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await Inventory.find();
        const validItems = items.filter(item => item.productName && item.brandName);
        if (validItems.length === 0) {
            res.status(404).json({ message: 'No valid inventory items found' });
            return;
        }
        res.status(200).json(validItems);
    } catch (error: unknown) {
        console.error('Error fetching inventory items:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};