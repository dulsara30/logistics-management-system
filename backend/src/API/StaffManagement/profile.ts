import express from "express";
import { addStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "../../Application/StaffManagement/staff";
import multer from "multer";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";
import { getProfileById, updateProfile } from "../../Application/StaffManagement/profile";

const profileRouter = express.Router();

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


// Route for all users to fetch their own profile
profileRouter
  .route("/profile")
  .get(authenticateToken, authorizeRole([
    "Business Owner",
    "Warehouse Manager",
    "Inventory Manager",
    "Driver",
    "Maintenance Staff",
    "Other Staff"
  ]), async (req, res) => {
    try {
      const userId = req.user?.id; // Extracted from JWT by authenticateToken middleware
      if (!userId) {
        return res.status(401).json({ message: "User ID not found in token" });
      }
      const staff = await getProfileById(userId, res);
      return staff; // getStaffById already sends the response
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: (error as Error) });
    }
  });

// Route for all users to update their own profile
profileRouter
  .route("/profile")
  .put(
    authenticateToken,
    authorizeRole([
      "Business Owner",
      "Warehouse Manager",
      "Inventory Manager",
      "Driver",
      "Maintenance Staff",
      "Other Staff"
    ]),
    upload.single("profilePic"),
    async (req, res) => {
      try {
        const userId = req.user?.id; // Extracted from JWT by authenticateToken middleware
        if (!userId) {
          return res.status(401).json({ message: "User ID not found in token" });
        }
        const updatedStaff = await updateProfile(userId, req, res);
        return updatedStaff; // updateStaff already sends the response
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
      }
    }
  );

export default profileRouter;