// import mongoose, { Schema } from "mongoose";

// const InventoryManagementSchema = new Schema({
//   name: { type: String, required: true },
//   supplierID: { type: String, required: true },
//   category: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   location: { type: String, required: true },
//   lastUpdated: { type: String, required: true },
//   supplierName: { type: String, required: true },
//   unitPrice: { type: Number, required: true },
//   expirationDate: { type: String, required: true },
//   notes: { type: String, required: true },
// });

// export default mongoose.model("InventoryManagement", InventoryManagementSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  productName: string;
  brandName: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  updatedIn: Date;
  createdIn: Date;
  expiryDate: Date;
  supplierName: string;
  reorderLevel: number;
}

const inventorySchema: Schema = new Schema({
  productName: { type: String, required: true },
  brandName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  updatedIn: { type: Date, required: true },
  createdIn: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  supplierName: { type: String, required: true },
  reorderLevel: { type: Number, required: true },
});

export default mongoose.model<IInventory>("Inventory", inventorySchema);