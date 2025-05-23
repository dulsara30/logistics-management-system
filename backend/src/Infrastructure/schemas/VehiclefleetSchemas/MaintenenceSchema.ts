import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema({

    VehicleNumber: { 
      type: String, 
      required: true,
      ref: 'Vehicle',  // Reference to the Vehicle collection
    },

    MaintenanceID: { type: String, required: true,unique: true,index: true },
    MaintenanceDate: { type: Date, required: true },
    Type: { type: String, required: true },
    Cost: { type: Number, required: true },
    Description: { type: String, },
  });
  
  const Maintenance = mongoose.model("maintenance", MaintenanceSchema);
  
  export default Maintenance;
  