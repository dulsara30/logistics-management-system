import express from "express";
import { addStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "../../Application/StaffManagement/staff";
import multer from "multer";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";

const profileRouter = express.Router();

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

// Modified GET /profile to fetch the logged-in user's profile
profileRouter.route("/profile").get(authenticateToken, authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]), async (req: express.Request, res: express.Response) => {
    try {
        const user = (req as any).user; // Added by authenticateToken middleware
        if (!user || !user.id) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        const staff = await getStaffById(req, res); // Call getStaffById with req and res
        // Since getStaffById already sends the response, we don't need to do anything else here
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

profileRouter.route("/profile").post(authenticateToken, authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]), upload.single("profilePic"), addStaff);

// Fixed the route path to include the colon (:id)
profileRouter.route("/profile/:id").get(authenticateToken, authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]), getStaffById).put(authenticateToken, authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]), updateStaff).delete(authenticateToken, authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]), deleteStaff);

/*staffRouter.route("/manage-staff/:id").delete(deleteStaff);*/

export default profileRouter;