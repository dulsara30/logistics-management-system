

import express from 'express';


import { createMaintenance,updateMaintenance,deleteMaintenance,getMaintenanceById,getAllMaintenance} from '../../Application/VehicleFleet/VehicleMaintenenaceApp';

const router = express.Router();

// Route to create a new maintenance record
router.post('/maintenance', async (req, res) => {
  const { VehicleNumber, MaintenanceDate, Type, Cost, Description } = req.body;

  try {
    const newMaintenance = await createMaintenance(
      VehicleNumber,
      MaintenanceDate,
      Type,
      Cost,
      Description
    );

    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(400).json({ message: 'Error creating maintenance record', error });
  }
});


// Route to get a maintenance record by ID
router.get('/maintenance/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const maintenance = await getMaintenanceById(id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    res.json(maintenance);
  } catch (error: any) {
    res.status(400).json({ message: 'Error fetching maintenance record', error: error.message });
  }
});


// Route to update an existing maintenance record by ID
router.put('/maintenance/:id', async (req, res) => {
  const { id } = req.params;
  const { MaintenanceDate, Type, Cost, Description } = req.body;

  try {
    const updatedMaintenance = await updateMaintenance(
      id,
      MaintenanceDate ? new Date(MaintenanceDate) : undefined,
      Type,
      Cost,
      Description
    );

    if (!updatedMaintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.json(updatedMaintenance);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating maintenance record', error: error.message });
  }
});

// Route to delete a maintenance record by ID
router.delete('/maintenance/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMaintenance = await deleteMaintenance(id);

    if (!deletedMaintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
 
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: 'Error deleting maintenance record', error: error.message });
  }
});


// New route to get all maintenance records
router.get('/maintenance', async (req, res) => {
    try {
    const allMaintenance = await getAllMaintenance();
    res.json(allMaintenance);
   } catch (error: any) {
    res.status(500).json({ message: 'Error fetching all maintenance records', error: error.message });
   }
  });



export default router;

