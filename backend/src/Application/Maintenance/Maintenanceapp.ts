// Application/userService.ts
import Maintenance from "../../Infrastructure/schemas/Maintenance/MaintenanceSchema";
import { Request, Response } from 'express';


// Read all Warehouse (create)
export const getAllMaintenance = async () => {
  try {
    const maintenance = await Maintenance.find(); // fetch all warehouse from the collection
    return maintenance;
  } catch (error) {
    console.error("Error retrieving warehousemaintenance:", error);
    throw new Error("Error retrieving Warehouse ");
  }
};


// (creat) a warehouse by ID
export const getMaintenanceById = async (Mid: string) => {
  try {
    return await Maintenance.find({ID:Mid});
  } catch (error) {
    console.error("Error fetching Maintenance:", error);
    throw new Error("Error fetching Maintenance");
  }}


export const createMaintenance = async (
  ID: String,
  warehouse: string,
  date: string,
  description: string,
  otherCharges: string,
  items: string,
  Quantity: Number,
  PriceperItem: Number,
  

) => {
  try {

    // Create a new warehouse instance or object with the provided data
    const W = new Maintenance({ ID,warehouse,date,description,otherCharges,items,Quantity,PriceperItem
     });

    // Save the new warehouse to the database and return the result
    const savedmaintenance = await W.save();
    return savedmaintenance;

  } catch (error) {

    console.error("Error creating Maintenance:", error);
    throw new Error("Error creating Maintenance");

  }
};






// (update) update a warehouse by ID
export const updateMaintenance = async (
  ID: string,
  updates: {
    warehouse?: string,
    date?: string,
    description?: string,
    otherCharges?: string,
    items?: string,
    Quantity?: number,
    PriceperItem?: number,
    
  }
) => {
  try {
    // Find the warehouse by WarehouseID and update it with the new details
    const updateMaintenance = await Maintenance.findOneAndUpdate(
      { ID: ID }, // match by WarehouseID
      { $set: updates },             // apply the updates
      { new: true }                  // return the updated document
    );

    if (!updateMaintenance) {
      throw new Error("Maintenance not found");
    }

    return updateMaintenance;
  } catch (error) {
    console.error("Error updating Maintenance:", error);
    throw new Error("Error updating Maintenance");
  }
};








// (delete) delete a warehouse by ID
export const deletemaintenance = async (ID: string) => {
  try {
    // Find the warehouse by WarehouseID and delete it
    const deletedmaintenance = await Maintenance.findOneAndDelete({ ID });

    if (!deletedmaintenance) {
      throw new Error("Warehouse not found");
    }

    return deletedmaintenance;
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    throw new Error("Error deleting maintenance");
  }
};


