import express from "express";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";
import { exportAttendancePDF, getAttendanceAnalytics, getEmployeeDetails, getTodayStats } from "../../Application/StaffManagement/attendanceAnalytics";

const attendanceRoute = express.Router();

attendanceRoute
  .route("/attendance")
  .get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getAttendanceAnalytics);


attendanceRoute.route("/employee-details").get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getEmployeeDetails);

attendanceRoute.route("/export-pdf").get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), exportAttendancePDF);

attendanceRoute.route("/today-stats").get(authenticateToken, authorizeRole(["Business Owner", "Warehouse Manager", "Inventory Manager"]), getTodayStats);

export default attendanceRoute;