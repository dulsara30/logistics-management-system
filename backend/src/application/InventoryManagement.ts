import { Request, Response } from "express";
import Items from "../Infrastructure/schemas/InventoryManagement";

interface InventoryItem {
  _id?: string;
  name: string;
  supplierID: string;
  category: string;
  quantity: number;
  location: string;
  lastUpdated: string;
  supplierName: string;
  unitPrice: number;
  expirationDate: string;
  notes: string;
}

// Get all inventory items with search and filtering
export const getAllInventoryManagement = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    let query: any = {};

    // Handle search (across name, supplierID, category)
    if (search) {
      const searchRegex = new RegExp(search as string, "i"); // Case-insensitive search
      query.$or = [
        { name: searchRegex },
        { supplierID: searchRegex },
        { category: searchRegex },
      ];
    }

    // Handle category filter
    if (category && category !== "All") {
      query.category = category;
    }

    const inventoryItems = await Items.find(query);
    return res.status(200).json(inventoryItems);
  } catch (error) {
    console.error("Error in getAllInventoryManagement:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new inventory item
export const createInventoryManagement = async (req: Request, res: Response) => {
  try {
    const newItem: InventoryItem = req.body;
    const createdItem = await Items.create(newItem);
    return res.status(201).json(createdItem);
  } catch (error) {
    console.error("Error in createInventoryManagement:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get an inventory item by ID
export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error("Error in getInventoryById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an inventory item by ID
export const deleteInventoryManagement = async (req: Request, res: Response) => {
  try {
    const result = await Items.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error in deleteInventoryManagement:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update an inventory item by ID
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const updatedItem = await Items.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document and validate the input
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error in updateInventory:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};