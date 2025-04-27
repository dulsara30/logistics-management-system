// API/routes.ts
import express from 'express';
import { createMaintenance, deleteMaintenance, getAllMaintenance, getMaintenanceById, updateMaintenance } from '../../Application/Maintenance/Maintenanceapp';
import maintainance from '../../Infrastructure/schemas/Maintenance/MaintenanceSchema';


const router = express.Router();







// Route to get all maintenance records
router.get('/maintenance', async (req, res) => {
  try {
    const maintenance = await getAllMaintenance();
    res.status(200).json(maintenance);
  } catch (error: any) {
    console.error("Error fetching maintenance records:", error);
    res.status(500).json({ message: "Error fetching maintenane records", error: error.message });
  }
});

// Route to get a maintenance record by ID
router.get('/maintenance/:requestId', async (req, res) => {
  const { requestId } = req.params;
  try {
    const maintenance = await getMaintenanceById(requestId);
    if (maintenance) {
      res.status(200).json(maintenance);
    } else {
      res.status(404).json({ message: "Maintenance record not found" });
    }
  } catch (error: any) {
    console.error("Error fetching maintenance record:", error);
    res.status(500).json({ message: "Error fetching maintenance record", error: error.message });
  }
});





// Create new maintenance record
router.post('/maintenance', async (req, res) => {
  const {
    warehouseId,
    issueDescription,
    priority,
    requestedBy,
    status,
    scheduledDate,
    completionDate
  } = req.body;

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
  } catch (error: any) {
    console.error("Error creating maintenance record:", error);
    res.status(500).json({ message: "Error creating maintenance record", error: error.message });
  }
});










// Update maintenance record
router.put('/maintenance/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const updates = req.body;

  try {
    const updatedMaintenance = await updateMaintenance(requestId, updates);

    if (updatedMaintenance) {
      res.status(200).json(updatedMaintenance);
    } else {
      res.status(404).json({ message: "Maintenance record not found" });
    }
  } catch (error: any) {
    console.error("Error updating maintenance record:", error);
    res.status(500).json({ message: "Error updating maintenance record", error: error.message });
  }
});









// Delete maintenance record
router.delete('/maintenance/:requestId', async (req, res) => {
  const { requestId } = req.params;

  try {
    const deletedMaintenance = await deleteMaintenance(requestId);

    if (deletedMaintenance) {
      res.status(200).json({ message: "Maintenance record deleted successfully" });
    } else {
      res.status(404).json({ message: "Maintenance record not found" });
    }
  } catch (error: any) {
    console.error("Error deleting maintenance record:", error);
    res.status(500).json({ message: "Error deleting maintenance record", error: error.message });
  }
});

export default router;