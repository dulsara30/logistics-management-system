import express from "express";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";
import { getAllInventoryManagement } from "../../Application/Inventory/InventoryManagement";


const getItemRoutetr = express.Router();

getItemRoutetr.route("/add-damage").get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getAllInventoryManagement);

export default getItemRoutetr;