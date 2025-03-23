// API/routes.ts
import express from 'express';
import { getMaintenanceById } from '../../Application/Maintenance/Maintenanceapp';
import {  createRoutingMaintenance, deleteroutingmaintenance, getAllMaintenance, updateRoutingMaintenance } from '../../Application/RoutingMaintenance/RoutingMaintenanceapp';

const router = express.Router();





// Route to get all warehouses
router.get('/routingmaintenance', async (req, res) => {
    try {
      const RoutingMaintenance = await getAllMaintenance();
      res.status(200).json(RoutingMaintenance);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching maintenance', error });
    }
  });

  // Route to get a warehouse by ID
  router.get('/routingmaintenance/:RID', async (req, res) => {
    const { RID } = req.params;
    try {
      const RoutingMaintenance = await getMaintenanceById(RID);
      if (RoutingMaintenance) {
        res.status(200).json(RoutingMaintenance);
      } else {
        res.status(404).json({ message: "RoutingMaintenance not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });







//post(create)
router.post('/routingmaintenance', async (req, res) => {

  const {RID,warehouse,date,waterbill,currentbill,description
   } = req.body;

  try {
    
    // Call the service function to create and save the new vehicle
    const newMaintenance = await createRoutingMaintenance(RID,warehouse,date,waterbill,currentbill,description);

    // Return the created vehicle data as JSON
    res.status(201).json(newMaintenance);


  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle', error });
  }
});






// update a warehouse by ID
router.put('/routingmaintenance/:RID', async (req, res) => {
    const { RID } = req.params;
    const updates = req.body; // Get the updated data from the request body
  
    try {
      const updatedRoutingMaintenance = await updateRoutingMaintenance(RID, updates);
  
      if (updatedRoutingMaintenance) {
        res.status(200).json(updatedRoutingMaintenance);
      } else {
        res.status(404).json({ message: "Routing Maintenance not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });






// delete a warehouse by ID
router.delete('/routingmaintenance/:RID', async (req, res) => {
    const { RID } = req.params;

    try {
        // Call the service function to delete the warehouse
        const deletedroutingmaintenance = await deleteroutingmaintenance(RID);

        if (deletedroutingmaintenance) {
            res.status(200).json({ message: "routing maintenance deleted successfully" });
        } else {
            res.status(404).json({ message: "routing maintenance not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


export default router;