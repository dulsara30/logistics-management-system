import express from "express";
import { addStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "../../Application/StaffManagement/staff";
import multer from "multer";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";


const staffRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if(extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
    },
    limits: {fileSize: 5 * 1024 * 1024},
});

staffRouter.route("/manage-staff").get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager" ]), getAllStaff);
staffRouter.route("/add-staff").post(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager"]),  upload.single("profilePic"), addStaff);
staffRouter.route("/manage-staff/:id").get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager" ]), getStaffById).put(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager" ]), updateStaff).delete( authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager" ]), deleteStaff);

/*staffRouter.route("/manage-staff/:id").delete(deleteStaff);*/

export default staffRouter;
