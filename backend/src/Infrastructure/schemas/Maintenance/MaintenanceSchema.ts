import mongoose from "mongoose";
//const AutoIncrement = require("mongoose-sequence")(mongoose);

const MaintainanceSchema = new mongoose.Schema({
    ID: { type: String, unique: true},
    warehouse: { type: String, required: true },
    date: { type: Number, required: true },
    description: { type: String, required: true },
    otherCharges: { type: Number, default: 0  },
    items: { type: String, default: 0 },
    Quantity: {type: Number, default: 0 },
    PriceperItem: {type: Number, default: 0},
    
});


const maintainance = mongoose.model("maintainace", MaintainanceSchema);
export default maintainance;