import express from "express";
import connectDB from "./Infrastructure/db"; // Import the connectDB function
import VehicleFleetRoutes from "./API/VehicleFleet/VehiclefleetAPI"; // Import routes
import DeliverySchdeulingRoutes from "./API/DeliveryScheduling/DeliverySchedulingAPI"
import cors from 'cors';



const app = express();

// Enable CORS globally for all routes
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB before setting up routes
connectDB();

// Use your routes for API handling
app.use("/api", VehicleFleetRoutes , DeliverySchdeulingRoutes);

// Start the server
app.listen(8000, () => console.log("Server is listening on port 8000."));

// Default route for testing
app.get('/', (req, res) => {
  res.send("Hello from ts");
});
