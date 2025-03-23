// API/routes.ts
import express from 'express';
import { createMaintenance, deletemaintenance, getAllMaintenance, getMaintenanceById, updateMaintenance} from '../../Application/Maintenance/Maintenanceapp';


const router = express.Router();





// Route to get all warehouses
router.get('/maintenance', async (req, res) => {
    try {
      const maintenance = await getAllMaintenance();
      res.status(200).json(maintenance);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching maintenance', error });
    }
  });

  // Route to get a warehouse by ID
  router.get('/maintenance/:ID', async (req, res) => {
    const { ID } = req.params;
    try {
      const maintenance = await getMaintenanceById(ID);
      if (maintenance) {
        res.status(200).json(maintenance);
      } else {
        res.status(404).json({ message: "maintenance not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });







//post(create)
router.post('/maintenance', async (req, res) => {

  const {ID,warehouse,date,description,otherCharges,items,Quantity,
    PriceperItem
   } = req.body;

  try {
    
    // Call the service function to create and save the new vehicle
    const newMaintenance = await createMaintenance(ID,warehouse,date,description,otherCharges,items,Quantity,PriceperItem);

    // Return the created vehicle data as JSON
    res.status(201).json(newMaintenance);


  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle', error });
  }
});






// update a warehouse by ID
router.put('/maintenance/:ID', async (req, res) => {
    const { ID } = req.params;
    const updates = req.body; // Get the updated data from the request body
  
    try {
      const updatedMaintenance = await updateMaintenance(ID, updates);
  
      if (updatedMaintenance) {
        res.status(200).json(updatedMaintenance);
      } else {
        res.status(404).json({ message: "Maintenance not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });






// delete a warehouse by ID
router.delete('/maintenance/:ID', async (req, res) => {
    const { ID } = req.params;

    try {
        // Call the service function to delete the warehouse
        const deletedmaintenance = await deletemaintenance(ID);

        if (deletedmaintenance) {
            res.status(200).json({ message: "maintenance deleted successfully" });
        } else {
            res.status(404).json({ message: "maintenance not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


export default router;