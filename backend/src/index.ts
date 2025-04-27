import "dotenv/config";
import express from "express";
import {connectDB} from "./Infrastructure/db"; // Import the connectDB function
import cors from "cors";

import router from "./API/WarehouseManagement/WarehouseAPI";
import router2 from "./API/Maintenance/MaintenanceAPI";
import router3 from "./API/RoutingMaintenance/MaintenanceRAPI";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,
} from "./Application/InventoryManagement";
import { Request, Response } from "express";
import suppliersRouter from "./API/SpplierManagement/suppliers";
import staffRouter from "./API/StaffManagement/staff";
import loginRouter from "./API/login/login";
import profileRouter from "./API/StaffManagement/profile";
import QRRouter from "./API/StaffManagement/QRCode";

const app = express();

// Cross-Origin Resource Sharing (CORS) to connect frontend and backend
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes for API handling
app.use("/api", router);
app.use("/api", router2);
app.use("/api", router3); // Handles routing maintenance
app.use("/", loginRouter);
app.use("/staff", staffRouter);
app.use("/suppliers", suppliersRouter);
app.use("/", profileRouter);
app.use("/dashboard", QRRouter);

// Inventory routes
app
  .route("/inventory")
  .get(getAllInventoryManagement)
  .post(createInventoryManagement);

app
  .route("/inventory/:id")
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventoryManagement);

// Default route for testing
app.get('/', (req, res) => {
  res.send("Hello from ts");
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
