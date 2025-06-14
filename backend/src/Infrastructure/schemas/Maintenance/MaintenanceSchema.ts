import mongoose from "mongoose";
//const AutoIncrement = require("mongoose-sequence")(mongoose);

const MaintainanceSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  warehouseId: { type: String, required: true },
  issueDescription: { type: String, required: true },
  priority: { type: String, required: true }, // e.g., Low, Medium, High
  scheduledDate: { type: Date, required: true },
  completionDate: { type: Date, required: true },
    
});


const maintainance = mongoose.model("maintainance", MaintainanceSchema);
export default maintainance;

// drop box