// Application/userService.ts
import User from "../../Infrastructure/schemas/VehiclefleetSchemas/VehiclesSchema"; // Import User schema

import Vehicle from "../../Infrastructure/schemas/VehiclefleetSchemas/VehiclesSchema"


// Get user by name
export const getUserByName = async (name: string) => {

  return await User.findOne({ name });
};

// Get user by email
export const getUserByEmail = async (email: string) => {
    
  return await User.findOne({ email });
};


// Function to create a new user
export const createUser = async (name: string, email: string, password: string) => {

  const newUser = new User({ name, email, password });
  return newUser.save();  // Save the user and return the result

};



export const createVehicle = async (

  OwnersNIC: string,
  OwnersName: string,
  ContactNumber: string,
  Address: string,
  Email: string,
  VehicleNumber: string,
  VehicleType: string,
  FuelType: string,
  VehicleBrand: string,
  LoadCapacity: number,
  DriverID: string

) => {
  try {

    // Create a new vehicle instance with the provided data
    const newVehicle = new Vehicle({
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
      DriverID,
    });

    // Save the new vehicle to the database and return the result
    const savedVehicle = await newVehicle.save();
    return savedVehicle;

  } catch (error) {

    console.error("Error creating vehicle:", error);
    throw new Error("Error creating vehicle");

  }
};



export const getVehicles = async () => {

  try {

    const vehicles = await Vehicle.find(); // fetch all vehicles from the collection
    return vehicles;

  } catch (error) {
    console.error("Error retrieving vehicles:", error);
    throw new Error("Error retrieving vehicles");
  }
};



// Get vehicle by registered number

export const getVehicleByID = async (VehicleNumber: string) => {

  try {

      const vehicle = await Vehicle.findOne({ VehicleNumber });

    if (!vehicle) {

      //vehicle is not found
      throw new Error('Vehicle not found');

    }

    return vehicle;


  } catch (error) {

    console.error('Error fetching vehicle:', error);
    throw error; 

  }
};
