import "dotenv/config";
import express from "express";
import connectDB from "./Infrastructure/db"; // Import the connectDB function
import VehicleFleetRoutes from "./API/VehicleFleet/VehiclefleetAPI"; // Import routes
import DeliverySchdeulingRoutes from "./API/DeliveryScheduling/DeliverySchedulingAPI"
import MaintenenceRoute from "./API/VehicleFleet/VehicleMaintenanceAPI";
import cors from 'cors';


import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  deleteInventoryManagement,
  updateInventory,
} from "./Application/InventoryManagement";
import { Request, Response } from "express";

import { resolve } from "path";
import { json } from "stream/consumers";
import { create } from "domain";
import suppliersRouter from "./API/SpplierManagement/suppliers";

import staffRouter from "./API/StaffManagement/staff";
import loginRouter from "./API/login/login";

const app = express();

// Enable CORS globally for all routes
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Connect to MongoDB before setting up routes
connectDB();

// Use your routes for API handling
app.use("/api", VehicleFleetRoutes , DeliverySchdeulingRoutes,MaintenenceRoute);

// Start the server
app.listen(8000, () => console.log("Server is listening on port 8000."));

// Default route for testing
app.get('/', (req, res) => {
  res.send("Hello from ts");
});
connectDB();

app.use("/", loginRouter)
app.use("/staff", staffRouter);
app.use("/suppliers", suppliersRouter);

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
