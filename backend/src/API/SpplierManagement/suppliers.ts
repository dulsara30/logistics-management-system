import express from "express";
import { createSupplierManagement, getAllSuppliers, getSupplierById, deleteSupplier, updateSupplier  } from "../../Application/SupplierManagement/suppliers";

const suppliersRouter = express.Router();

suppliersRouter.route("/").get(getAllSuppliers).post(createSupplierManagement);
suppliersRouter.route("/:_id").get(getSupplierById).put(updateSupplier).delete(deleteSupplier);


export default suppliersRouter;