import mongoose, { Schema } from "mongoose";

const InventoryManagementSchema = new Schema({
  name: { type: String, required: true },
  supplierID: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  lastUpdated: { type: String, required: true },
  supplierName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  expirationDate: { type: String, required: true },
  notes: { type: String, required: true },
});

export default mongoose.model("InventoryManagement", InventoryManagementSchema);

