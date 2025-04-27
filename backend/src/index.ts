import "dotenv/config";
import express from "express";
import connectDB from "./Infrastructure/db"; // Import the connectDB function
import cors from "cors";


import router from "./API/WarehouseManagement/WarehouseAPI"
import router2 from "./API/Maintenance/MaintenanceAPI"
import router3 from "./API/RoutingMaintenance/RoutingMaintenanceAPI"
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

//cros origin resouse sharing
//connect frontend port and backend port
//browaer can get these two port
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Connect to MongoDB before setting up routes
connectDB();

// Use your routes for API handling
app.use("/api", router);
app.use("/api", router2);
app.use("/api", router3);
    // handles routing maintenance



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
