import express, { Request, Response } from 'express';
import { createMaintenance, deleteMaintenance, getAllMaintenance, getMaintenanceById, updateMaintenance } from '../../Application/Maintenance/Maintenanceapp';

const router = express.Router();  // Corrected initialization

// Route to get all maintenance records
router.get('/maintenance', async (req: Request, res: Response) => {
  try {
    const maintenance = await getAllMaintenance();
    res.status(200).json(maintenance);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching maintenance records:", error);
      res.status(500).json({ message: "Error fetching maintenance records", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// Route to get a maintenance record by ID
router.get('/maintenance/:requestId', async (req: Request, res: Response) => {
  const { requestId } = req.params;
  try {
    const maintenance = await getMaintenanceById(requestId);
    if (maintenance) {
      res.status(200).json(maintenance);
    } else {
      res.status(404).json({ message: "Maintenance record not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching maintenance record:", error);
      res.status(500).json({ message: "Error fetching maintenance record", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});



// Create new maintenance record
router.post('/maintenance', async (req: Request, res: Response) => {
  const { warehouseId, issueDescription, priority, requestedBy, status, scheduledDate, completionDate } = req.body;

  try {
    const newMaintenance = await createMaintenance(
      warehouseId,
      issueDescription,
      priority,
      requestedBy,
      status,
      scheduledDate,
      completionDate
    );

    res.status(201).json(newMaintenance);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating maintenance record:", error);
      res.status(500).json({ message: "Error creating maintenance record", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});



// Update maintenance record
router.put('/maintenance/:requestId', async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const updates = req.body;

  try {
    const updatedMaintenance = await updateMaintenance(requestId, updates);

    if (updatedMaintenance) {
      res.status(200).json(updatedMaintenance);
    } else {
      res.status(404).json({ message: "Maintenance record not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating maintenance record:", error);
      res.status(500).json({ message: "Error updating maintenance record", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

// Delete maintenance record
router.delete('/maintenance/:requestId', async (req: Request, res: Response) => {
  const { requestId } = req.params;

  try {
    const deletedMaintenance = await deleteMaintenance(requestId);

    if (deletedMaintenance) {
      res.status(200).json({ message: "Maintenance record deleted successfully" });
    } else {
      res.status(404).json({ message: "Maintenance record not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting maintenance record:", error);
      res.status(500).json({ message: "Error deleting maintenance record", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
