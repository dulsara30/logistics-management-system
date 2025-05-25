import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const WarehouseSchema = new mongoose.Schema({
    WarehouseID: { type: String, unique: true},
    StreetName: { type: String, required: true },
    City: { type: String, required: true },
    Province: { type: String, required: true },
    SpecialInstruction: { type: String },
    Description: { type: String },
    Bulkysecsize: {type: Number, default: 0 },
    Hazardoussecsize: {type: Number, default: 0},
    Perishablesecsize: {type: Number, default: 0},
    Sparesecsize: {type: Number, default: 0},
    Otheritems: {type: Number, default: 0},
});


const Warehouse = mongoose.model("warehouses", WarehouseSchema);
export default Warehouse;