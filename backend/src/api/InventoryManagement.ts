import Express from "express";
import { createInventoryManagement, deleteInventoryManagement, getAllInventoryManagement, getInventoryById, updateInventory } from "../application/InventoryManagement";

const inventoryRouter = Express.Router();

inventoryRouter.route("/").get(getAllInventoryManagement).post(createInventoryManagement);
inventoryRouter.route("/:id").get(getInventoryById).put(updateInventory).delete(deleteInventoryManagement);


export default inventoryRouter;