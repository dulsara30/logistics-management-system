// API/routes.ts
import express from 'express';
import {createWarehouse, getWarehouseById, getAllWarehouses, updateWarehouse, deleteWarehouse} from "../../Application/WarehouseManagement/Warehouseapp";


const router = express.Router();


// Route to get all warehouses
router.get('/Warehouse', async (req, res) => {
    try {
      const warehouses = await getAllWarehouses();
      res.status(200).json(warehouses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching warehouses', error });
    }
  });

  // Route to get a warehouse by ID
  router.get('/Warehouse/:WarehouseID', async (req, res) => {
    const { WarehouseID } = req.params;
    try {
      const warehouse = await getWarehouseById(WarehouseID);
      if (warehouse) {
        res.status(200).json(warehouse);
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });



//post(read)
router.post('/Warehouse', async (req, res) => {

  const {WarehouseID,StreetName,City,Province,SpecialInstruction,Description,Bulkysecsize,
    Hazardoussecsize,Perishablesecsize,Sparesecsize,Otheritems
   } = req.body;

  try {
    
    // Call the service function to create and save the new vehicle
    const newWarehouse = await createWarehouse(WarehouseID,StreetName,City,Province,SpecialInstruction,Description,Bulkysecsize,
        Hazardoussecsize,Perishablesecsize,Sparesecsize,Otheritems);

    // Return the created vehicle data as JSON
    res.status(201).json(newWarehouse);


  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle', error });
  }
});




// update a warehouse by ID
router.put('/Warehouse/:WarehouseID', async (req, res) => {
    const { WarehouseID } = req.params;
    const updates = req.body; // Get the updated data from the request body
  
    try {
      const updatedWarehouse = await updateWarehouse(WarehouseID, updates);
  
      if (updatedWarehouse) {
        res.status(200).json(updatedWarehouse);
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });


  

// delete a warehouse by ID
router.delete('/Warehouse/:WarehouseID', async (req, res) => {
    const { WarehouseID } = req.params;

    try {
        // Call the service function to delete the warehouse
        const deletedWarehouse = await deleteWarehouse(WarehouseID);

        if (deletedWarehouse) {
            res.status(200).json({ message: "Warehouse deleted successfully" });
        } else {
            res.status(404).json({ message: "Warehouse not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


export default router;