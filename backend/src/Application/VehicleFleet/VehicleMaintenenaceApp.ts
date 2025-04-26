
import Maintenance from '../../Infrastructure/schemas/VehiclefleetSchemas/MaintenenceSchema';
import Vehicle from '../../Infrastructure/schemas/VehiclefleetSchemas/VehiclesSchema';

// Function to create a new maintenance record
export const createMaintenance = async (

  VehicleNumber: string,
  MaintenanceDate: Date,
  Type: string,
  Cost: number,
  Description: string
) => {

  try {
    // Generate a new MaintenanceID
    const newMaintenanceID = `M-${Date.now()}`;

    const newMaintenance = new Maintenance({
      VehicleNumber,
      MaintenanceID :newMaintenanceID,
      MaintenanceDate,
      Type,
      Cost,
      Description,
    });

    // Save the new maintenance record to the database
    const savedMaintenance = await newMaintenance.save();

    // Link the maintenance to the vehicle
    await Vehicle.findOneAndUpdate(
      { VehicleNumber },
      { $push: { Maintenance: savedMaintenance._id } }
    );

    return savedMaintenance;
  } catch (error) {
    console.error("Error creating maintenance record:", error);
    throw new Error("Error creating maintenance record");
  }
};
 
// Function to get a maintenance record by ID
export const getMaintenanceById = async (maintenanceId: string) => {
  try {
    const maintenanceRecord = await Maintenance.findOne({ MaintenanceID: maintenanceId });
    return maintenanceRecord;
  } catch (error: any) {
    console.error('Error fetching maintenance record:', error);
    throw new Error('Error fetching maintenance record');
  }
};

// Function to update an existing maintenance record by ID
export const updateMaintenance = async (
  maintenanceId: string,
  MaintenanceDate?: Date,
  Type?: string,
  Cost?: number,
  Description?: string
) => {
  try {
    const updatedMaintenance = await Maintenance.findOneAndUpdate(
      { MaintenanceID: maintenanceId },
      {
        $set: {
          MaintenanceDate,
          Type,
          Cost,
          Description,
        },
      },
      { new: true }
    );

    if (!updatedMaintenance) {
      // Handle the case where no maintenance record was found with the given ID
      console.log(`Maintenance record with ID ${maintenanceId} not found for update.`);
      return null; // Or throw a specific error
    }

    return updatedMaintenance;
  } catch (error: any) {
    console.error('Error updating maintenance record:', error);
    throw new Error('Error updating maintenance record');
  }
};



// Function to delete a maintenance record by MaintenanceID
export const deleteMaintenance = async (maintenanceId: string) => {
  try {
    const deletedMaintenance = await Maintenance.findOneAndDelete({ MaintenanceID: maintenanceId });

    if (deletedMaintenance) {
      // Remove the reference from the associated Vehicle document
      await Vehicle.findOneAndUpdate(
        { Maintenance: deletedMaintenance._id }, // Use the MongoDB _id of the deleted record
        { $pull: { Maintenance: deletedMaintenance._id } }
      );
    }

    return deletedMaintenance;
  } catch (error: any) {
    console.error('Error deleting maintenance record:', error);
    throw new Error('Error deleting maintenance record');
  }
};

 // New function to get all maintenance details
 export const getAllMaintenance = async () => {
   try {
    const allMaintenanceRecords = await Maintenance.find();
    return allMaintenanceRecords;
   } catch (error: any) {
    console.error('Error fetching all maintenance records:', error);
    throw new Error('Error fetching all maintenance records');
   }
  };

