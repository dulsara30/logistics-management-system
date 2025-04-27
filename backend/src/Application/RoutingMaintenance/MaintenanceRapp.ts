// Application/userService.ts
//import Maintenance from "../../Infrastructure/schemas/Maintenance/MaintenanceSchema";
import { Request, Response } from 'express';
import maintainanceR from '../../Infrastructure/schemas/RoutingMaintenance/MaintenanceRSchema';



// Read all Warehouse 
export const getAllRoutingMaintenance = async () => {
  try {
    const RoutingMaintenance = await maintainanceR.find(); // fetch all warehouse from the collection
    return RoutingMaintenance;
  } catch (error) {
    console.error("Error retrieving warehouse maintenance Routing:", error);
    throw new Error("Error retrieving Warehouse ");
  }
};




// (read) a warehouse by ID
export const getRoutingMaintenanceById = async (Mrid: string) => {
  try {
    return await maintainanceR.find({RID:Mrid});
  } catch (error) {
    console.error("Error fetching Maintenance:", error);
    throw new Error("Error fetching Maintenance");
  }}







  
export const createRoutingMaintenance = async (
  
  warehouse: string,
  date: number,
  waterbill: number,
  currentbill: number,
  description: string,

) => {
  try {

    //auto generated warehouse id
    const RID = `RM-${Date.now()}`;


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


