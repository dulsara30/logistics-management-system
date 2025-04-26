import express from "express";
import { addStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "../../Application/StaffManagement/staff";
import multer from "multer";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";
import { getProfileById, updateProfile } from "../../Application/StaffManagement/profile";

const staffRouter = express.Router();


const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for Cloudinary uploads
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

staffRouter
  .route("/manage-staff")
  .get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getAllStaff);

staffRouter
  .route("/add-staff")
  .post(
    authenticateToken,
    authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]),
    upload.single("profilePic"),
    addStaff
  );

staffRouter
  .route("/manage-staff/:id")
  .get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getStaffById)
  .put(
    authenticateToken,
    authorizeRole(["Business Owner", "Warehouse Manager"]),
    upload.single("profilePic"),
    updateStaff
  )
  .delete(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager"]), deleteStaff);



export default staffRouter;