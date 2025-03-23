// Application/userService.ts
//import Maintenance from "../../Infrastructure/schemas/Maintenance/MaintenanceSchema";
import { Request, Response } from 'express';
import maintainanceR from "../../Infrastructure/schemas/RoutingMaintenance/RoutingMaintenanceSchema";


// Read all Warehouse (create)
export const getAllMaintenance = async () => {
  try {
    const RoutingMaintenance = await maintainanceR.find(); // fetch all warehouse from the collection
    return RoutingMaintenance;
  } catch (error) {
    console.error("Error retrieving warehouse maintenance Routing:", error);
    throw new Error("Error retrieving Warehouse ");
  }
};


// (creat) a warehouse by ID
export const getMaintenanceById = async (Mid: string) => {
  try {
    return await maintainanceR.find({RID:Mid});
  } catch (error) {
    console.error("Error fetching Maintenance:", error);
    throw new Error("Error fetching Maintenance");
  }}


export const createRoutingMaintenance = async (
  RID: String,
  warehouse: string,
  date: number,
  waterbill: number,
  currentbill: number,
  description: string,

) => {
  try {

    // Create a new warehouse instance or object with the provided data
    const W = new maintainanceR({ RID,warehouse,date,waterbill,currentbill,description
     });

    // Save the new warehouse to the database and return the result
    const savedroutingmaintenance = await W.save();
    return savedroutingmaintenance;

  } catch (error) {

    console.error("Error creating routing Maintenance:", error);
    throw new Error("Error creating routing Maintenance");

  }
};






// (update) update a warehouse by ID
export const updateRoutingMaintenance = async (
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
    const updateRoutingMaintenance = await maintainanceR.findOneAndUpdate(
      { RID: ID }, // match by WarehouseID
      { $set: updates },             // apply the updates
      { new: true }                  // return the updated document
    );

    if (!updateRoutingMaintenance) {
      throw new Error("Routing Maintenance not found");
    }

    return updateRoutingMaintenance;
  } catch (error) {
    console.error("Error updating Maintenance:", error);
    throw new Error("Error updating Maintenance");
  }
};








// (delete) delete a warehouse by ID
export const deleteroutingmaintenance = async (RID: string) => {
  try {
    // Find the warehouse by WarehouseID and delete it
    const deletedroutingmaintenance = await maintainanceR.findOneAndDelete({ RID });

    if (!deletedroutingmaintenance) {
      throw new Error("Warehouse not found");
    }

    return deletedroutingmaintenance;
  } catch (error) {
    console.error("Error deleting roitng maintenance:", error);
    throw new Error("Error deleting routing maintenance");
  }
};


