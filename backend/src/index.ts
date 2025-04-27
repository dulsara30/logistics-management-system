import "dotenv/config";
import express from "express";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,
} from "./Application/InventoryManagement";
import { Request, Response } from "express";
import { connectDB } from "./Infrastructure/db";
import { resolve } from "path";
import { json } from "stream/consumers";
import { create } from "domain";
import suppliersRouter from "./API/SpplierManagement/suppliers";
import cors from "cors";
import staffRouter from "./API/StaffManagement/staff";
import loginRouter from "./API/login/login";
import profileRouter from "./API/StaffManagement/profile";
import QRRouter from "./API/StaffManagement/QRCode";


const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

connectDB();

app.use("/", loginRouter)
app.use("/staff", staffRouter);
app.use("/suppliers", suppliersRouter);
app.use("/", profileRouter);
app.use("/dashboard", QRRouter)

app
  .route("/inventory")
  .get(getAllInventoryManagement)
  .post(createInventoryManagement);

app
  .route("/inventory/:id")
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventoryManagement);


const PORT = 8000

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
