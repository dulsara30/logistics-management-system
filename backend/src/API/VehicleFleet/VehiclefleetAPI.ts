
import express from 'express';
import {getUserByEmail,getUserByName,createVehicle,getVehicles,getVehicleByID} from '../../Application/VehicleFleet/VehicleApp'; // Import service methods

const router = express.Router();



// Route to get user by name
router.get('/users/name/:name', async (req, res) => {

  const { name } = req.params; // Extract name from URL

  try {

    const user = await getUserByName(name); // Call service method

    if (user) {
      res.status(200).json(user); // Return user if found
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }


});

// Route to get user by email
router.get('/users/email/:email', async (req, res) => {

  const { email } = req.params; // Extract email from URL

  try {
    const user = await getUserByEmail(email); // Call service method
    if (user) {
      res.status(200).json(user); // Return user if found
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



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




export default router;






