
import Maintenance from '../../Infrastructure/schemas/VehiclefleetSchemas/MaintenenceSchema';
import Vehicle from '../../Infrastructure/schemas/VehiclefleetSchemas/VehiclesSchema';

// Function to create a new maintenance record
export const createMaintenance = async (
  VehicleNumber: string,
  MaintenanceID: string,
  MaintenanceDate: Date,
  Type: string,
  Cost: number,
  Description: string
) => {
  try {
    const newMaintenance = new Maintenance({
      VehicleNumber,
      MaintenanceID,
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
