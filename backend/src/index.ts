import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,

} from "./Application/Inventory/InventoryManagement";

import {
  stockoutInventory,
} from "./Application/Inventory/stockout"

import { connectDB } from "./Infrastructure/db";
import suppliersRouter from "./API/SpplierManagement/suppliers";
import cors from "cors";
import staffRouter from "./API/StaffManagement/staff";
import loginRouter from "./API/login/login";
import getItemRouter from "./API/Return&DamageHandling/damageForm";
import profileRouter from "./API/StaffManagement/profile";
import QRRouter from "./API/StaffManagement/QRCode";
import attendanceRoute from "./API/StaffManagement/attendance";
import leaveRoutes from "./API/StaffManagement/leaveRoutes";
import { deleteDamageReport, getInventoryItems, sendReturnReport, updateDamageReport } from "./Application/Return&DamageHandling/DamageReport"

const app: Express = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes that do not require authentication
app.use("/", loginRouter);

// Middleware to validate token for protected routes
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  // Validate token here (e.g., using JWT)
  // For simplicity, assuming token is valid
  next();
};

// Apply authentication middleware to protected routes
app.use(authenticateToken);

// Protected routes
app.use("/staff", staffRouter);
app.use("/suppliers", suppliersRouter);
app.use("/returns", getItemRouter);
app.use("/returns", getItemRouter);
app.use("/returns", getItemRouter);
app.use("/", profileRouter);
app.use("/dashboard", QRRouter);
app.use("/dashboard", QRRouter)
app.use("/analytics", attendanceRoute);
app.use("/leaves", leaveRoutes);

app.route("/returns/send-return-report").post(sendReturnReport);
app.route("/returns/add-damage/:id").put(updateDamageReport);
app.route("/returns/add-damage/:id").delete(deleteDamageReport);

app
  .route("/inventory")
  .get(getAllInventoryManagement, getInventoryItems)
  .post(createInventoryManagement);

app
  .route("/inventory/:id")
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventoryManagement);

// Stockout route
app
  .route("/inventory/stockout/:id")
  .post(stockoutInventory);

const PORT: number = 8000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));