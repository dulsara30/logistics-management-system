import "dotenv/config";
import express from "express";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,
} from "./Application/InventoryManagement";
import { connectDB } from "./Infrastructure/db";
import suppliersRouter from "./API/SpplierManagement/suppliers";
import cors from "cors";
import staffRouter from "./API/StaffManagement/staff";
import loginRouter from "./API/login/login";
import getItemRoutetr from "./API/Return&DamageHandling/damageForm";
import profileRouter from "./API/StaffManagement/profile";
import QRRouter from "./API/StaffManagement/QRCode";
import attendanceRoute from "./API/StaffManagement/attendance";


const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

connectDB();

app.use("/", loginRouter)
app.use("/staff", staffRouter);
app.use("/suppliers", suppliersRouter);
app.use("/returns", getItemRoutetr);
app.use("/", profileRouter);
app.use("/dashboard", QRRouter)
app.use("/analytics", attendanceRoute);

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
