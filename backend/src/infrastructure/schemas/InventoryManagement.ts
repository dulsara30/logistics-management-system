const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
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
  supplierID: { type: String }, // Optional, if you still need it for barcode mapping
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export default Item