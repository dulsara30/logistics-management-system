import express from "express";
import connectDB from "./Infrastructure/db"; // Import the connectDB function
import cors from "cors";


import router from "./API/WarehouseManagement/WarehouseAPI"
import router2 from "./API/Maintenance/MaintenanceAPI"
import router3 from "./API/RoutingMaintenance/RoutingMaintenanceAPI"

const app = express();

//cros origin resouse sharing
//connect frontend port and backend port
//browaer can get these two port
app.use(cors());

app.use(express.json());

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