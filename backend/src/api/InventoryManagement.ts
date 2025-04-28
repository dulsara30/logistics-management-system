import express from "express";
import {
  getAllInventoryManagement,
  createInventoryManagement,
  getInventoryById,
  updateInventory,
  deleteInventoryManagement,
} from "../Application/Inventory/InventoryManagement";
import { authenticateToken, authorizeRole } from "../middleware/authentication"; // Add these middleware

const inventoryRouter = express.Router();

// Routes for inventory management
inventoryRouter
  .route("/")
  .get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getAllInventoryManagement)
  .post(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager"]), createInventoryManagement);

inventoryRouter
  .route("/:id")
  .get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getInventoryById)
  .put(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), updateInventory)
  .delete(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), deleteInventoryManagement);

export default inventoryRouter;