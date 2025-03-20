import express from "express";
import { addStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "../../Application/StaffManagement/staff";


const staffRouter = express.Router();
staffRouter.route("/manage-staff").get(getAllStaff);
staffRouter.route("/add-staff").post(addStaff);
staffRouter.route("/manage-staff/:id").get(getStaffById).put(updateStaff).delete(deleteStaff);

export default staffRouter;
