// Application/userService.ts
import Maintenance from "../../Infrastructure/schemas/Maintenance/MaintenanceSchema";
import { Request, Response } from 'express';





// Read all Maintenance records
export const getAllMaintenance = async () => {
  try {
    const maintenance = await Maintenance.find();
    return maintenance;
  } catch (error) {
    console.error("Error retrieving maintenance records:", error);
    throw new Error("Error retrieving maintenance records");
  }
};



// Get a maintenance record by ID
export const getMaintenanceById = async (Mid: string) => {
  try {
    return await Maintenance.findOne({requestId: Mid});
  } catch (error) {
    console.error("Error fetching Maintenance:", error);
    throw new Error("Error fetching Maintenance");
  }
}






export const createMaintenance = async (
  
  warehouseId: string,
  issueDescription: string,
  priority: string,
  requestedBy: string,
  status: string,
  scheduledDate: Date,
  completionDate: Date,
) => {
  try {

    const requestId = `MN-${Date.now()}`;

    const maintenance = new Maintenance({
    requestId,
    warehouseId,
    issueDescription,
    priority,
    requestedBy,
    status,
    scheduledDate,
    completionDate
    });

    const savedMaintenance = await maintenance.save();
    return savedMaintenance;
  } catch (error) {
    console.error("Error creating Maintenance:", error);
    throw new Error("Error creating Maintenance");
  }
};







// Update maintenance record
export const updateMaintenance = async (
  requestId: string,
  updates: {
    warehouseId?: string,
    issueDescription?: string,
    priority?: string,
    requestedBy?: string,
    status?: string,
    scheduledDate?: Date,
    completionDate?: Date,
      
  }
) => {
  try {
    const updatedMaintenance = await Maintenance.findOneAndUpdate(
      { requestId: requestId },
      { $set: updates },
      { new: true }
    );

    if (!updatedMaintenance) {
      throw new Error("Maintenance record not found");
    }

    return updatedMaintenance;
  } catch (error) {
    console.error("Error updating Maintenance:", error);
    throw new Error("Error updating Maintenance");
  }
};







// Delete maintenance record
export const deleteMaintenance = async (requestId: string) => {
  try {
    const deletedMaintenance = await Maintenance.findOneAndDelete({ requestId });

    if (!deletedMaintenance) {
      throw new Error("Maintenance record not found");
    }

    return deletedMaintenance;
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    throw new Error("Error deleting maintenance");
  }
};
 

 
