

import express from 'express';


import { createMaintenance} from '../../Application/VehicleFleet/VehicleMaintenenaceApp';

const router = express.Router();

// Route to create a new maintenance record
router.post('/maintenance', async (req, res) => {
  const { VehicleNumber, MaintenanceID, MaintenanceDate, Type, Cost, Description } = req.body;

  try {
    const newMaintenance = await createMaintenance(
      VehicleNumber,
      MaintenanceID,
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

export default router;
