
import express from 'express';
import {updateVehicleByID,createVehicle,getVehicles,getVehicleByID} from '../../Application/VehicleFleet/VehicleApp'; // Import service methods

const router = express.Router();




//create vehicle

router.post('/vehicles', async (req, res) => {

  const {
    OwnersNIC,
    OwnersName,
    ContactNumber,
    Address,
    Email,
    VehicleNumber,
    VehicleType,
    FuelType,
    VehicleBrand,
    LoadCapacity,
    DriverID
  } = req.body;

  try {
    
    // Call the service function to create and save the new vehicle
    const newVehicle = await createVehicle(
      OwnersNIC,
      OwnersName,
      ContactNumber,
      Address,
      Email,
      VehicleNumber,
      VehicleType,
      FuelType,
      VehicleBrand,
      LoadCapacity,
      DriverID
    );

    // Return the created vehicle data as JSON
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle', error });
  }
});



//get all vehicles
router.get("/vehicles", async (req, res) => {

  try {
    const vehicles = await getVehicles();
    res.status(200).json(vehicles);

  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error });
  }
});



// Route to get vehicle details by VehicleNumber

router.get('/vehicles/:vehicleId', async (req, res) => {

  const { vehicleId } = req.params; // Extract vehicleId from the route parameter
  
  try {

    const vehicle = await getVehicleByID(vehicleId); 
    res.json(vehicle); // Send the vehicle data as a response

  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicle", error}); 
  }
});



// Route to Update vehicle details

router.put('/vehicles/:vehicleId', async (req, res) => {

  const { vehicleId } = req.params; // Extract vehicleId from the route parameter
  const updateData = req.body; // Extract the fields to be updated from the request body

  try {
    const result = await updateVehicleByID(vehicleId, updateData); 
    res.json(result); // Send a success message if the update is successful
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle", error });
  }
});



export default router;






