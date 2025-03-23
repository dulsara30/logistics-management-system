import "dotenv/config";
import express from "express";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,
} from "./application/InventoryManagement";
import { Request, Response } from "express";
import { connectDB } from "./Infrastructure/db";
import { resolve } from "path";
import { json } from "stream/consumers";
import { create } from "domain";
import suppliersRouter from "./API/SpplierManagement/suppliers";
import cors from "cors";
import staffRouter from "./API/StaffManagement/staff";
import loginRouter from "./API/login/login";

const app = express();
app.use(express.json());
app.use('/upload', express.static('upload'));
app.use(cors());

connectDB();

app.use("/", loginRouter)
app.use("/staff", staffRouter);
app.use("/suppliers", suppliersRouter);

app
  .route("/Inventory")
  .get(getAllInventoryManagement)
  .post(createInventoryManagement);

app
  .route("/Inventory/:id")
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventoryManagement);


const PORT = 8000

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
