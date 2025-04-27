import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const MaintenanceRSchema = new mongoose.Schema({
    RID: { type: String, unique: true},
    warehouse: { type: String, required: true },
    date: { type: Number, required: true },
    waterbill: { type: Number, default: 0},
    currentbill: { type: Number, default: 0  },
    description: { type: String, required: true },

});


const maintainanceR = mongoose.model("routingMaintainace", MaintenanceRSchema);
export default maintainanceR;




