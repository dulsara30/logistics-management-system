
import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  OwnersNIC: { 
    type: String, 
    required: true, 
    unique: true,  
    minlength: 12,  
    maxlength: 15,  
  },
  OwnersName: { 
    type: String, 
    required: true,
    minlength: 3, 
    maxlength: 100, 
  },
  ContactNumber: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/, 
  },
  Address: {
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  Email: {
    type: String, 
    required: true,
    unique: true,  
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
  },
  VehicleNumber: { 
    type: String, 
    required: true,
    unique: true, 
    maxlength: 20, 
  },
  VehicleType: { 
    type: String, 
    required: true, 
    
  },
  FuelType: { 
    type: String, 
    required: true, 
   
  },
  VehicleBrand: { 
    type: String, 
    required: true, 
    maxlength: 50, 
  },
  LoadCapacity: { 
    type: Number, 
    required: true, 
    min: 0, // Load capacity cannot be negative
  },
  DriverID: { 
    type: String, 
    required: true, 
   
  },

  Maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'maintenance' }],

});

const Vehicle = mongoose.model("vehicles", VehicleSchema);
export default Vehicle;
