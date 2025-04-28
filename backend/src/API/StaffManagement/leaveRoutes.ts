import express from "express";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";
import {
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  getMyLeaveRequests,
  getLeaveBalance,
  getAllLeaveRequests,
  updateLeaveStatus,
  generateLeaveReport,
} from "../../Application/StaffManagement/leaveController";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const leaveRoutes = express.Router();

// Routes for leave requests (Staff-only routes)
leaveRoutes
  .route("/")
  .post(
    authenticateToken,
    authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]),
    upload.single("attachment"),
    createLeaveRequest
  );

leaveRoutes
  .route("/:id")
  .put(
    authenticateToken,
    authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]),
    upload.single("attachment"),
    updateLeaveRequest
  )
  .delete(authenticateToken, deleteLeaveRequest);

leaveRoutes
  .route("/my-requests")
  .get(
    authenticateToken,
    authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]),
    getMyLeaveRequests
  );

leaveRoutes
  .route("/balance")
  .get(
    authenticateToken,
    authorizeRole(["Driver", "Maintenance Staff", "Other Staff"]),
    getLeaveBalance
  );

// Admin-only routes (Warehouse Manager)
leaveRoutes
  .route("/all")
  .get(authenticateToken, authorizeRole(["Warehouse Manager"]), getAllLeaveRequests);

leaveRoutes
  .route("/:id/status")
  .patch(authenticateToken, authorizeRole(["Warehouse Manager"]), updateLeaveStatus);

leaveRoutes
  .route("/report/:employeeId")
  .get(authenticateToken, authorizeRole(["Warehouse Manager"]), generateLeaveReport);

export default leaveRoutes;