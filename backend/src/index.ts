import express from "express";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,
} from "./application/InventoryManagement";
import { connectDB } from "./infrastructure/db";

const app = express();
app.use(express.json());

 connectDB();

app
  .route("/Inventory")
  .get(getAllInventoryManagement)
  .post(createInventoryManagement);

app
  .route("/Inventory/:id")
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventoryManagement);

app.listen(8000, () => console.log("Server is listening on port 8000."));

