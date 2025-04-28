import { Request, Response } from "express";
import LeaveRequest, { ILeaveRequest, IStaffMember } from "../../Infrastructure/schemas/leaveRequest";
import { uploadToCloudinary } from "../../utils/cloudinary";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

// Interface for leave balance response
interface LeaveBalanceResponse {
  totalLeavesTaken: number;
  remainingLeaves: number;
}

// Calculate leave days between two dates (inclusive)
const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
};

// Create a new leave request
export const createLeaveRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id; // Set by authenticateToken middleware
    const { leaveType, startDate, endDate, reason } = req.body;
    const year = new Date(startDate).getFullYear();

    // Handle file upload if provided
    let attachmentUrl: string | undefined;
    if (req.file) {
      const fileName = `leave_proof_${employeeId}_${Date.now()}`;
      attachmentUrl = await uploadToCloudinary(req.file, fileName, "leave_proofs");
    }

    const leaveRequest = await LeaveRequest.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      attachmentUrl,
      status: "Pending",
      year,
    });

    res.status(201).json(leaveRequest);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Update a leave request
export const updateLeaveRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id; // Set by authenticateToken middleware
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;

    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      res.status(404).json({ message: "Leave request not found" });
      return;
    }

    if (leaveRequest.employeeId.toString() !== employeeId) {
      res.status(403).json({ message: "Unauthorized: You can only update your own leave requests" });
      return;
    }

    if (leaveRequest.status !== "Pending") {
      res.status(400).json({ message: "Cannot update a leave request that is already approved or rejected" });
      return;
    }

    // Handle file upload if provided
    let attachmentUrl: string | null | undefined = leaveRequest.attachmentUrl;
    if (req.file) {
      const fileName = `leave_proof_${employeeId}_${Date.now()}`;
      attachmentUrl = await uploadToCloudinary(req.file, fileName, "leave_proofs");
    }

    leaveRequest.leaveType = leaveType;
    leaveRequest.startDate = startDate;
    leaveRequest.endDate = endDate;
    leaveRequest.reason = reason;
    leaveRequest.attachmentUrl = attachmentUrl;
    leaveRequest.year = new Date(startDate).getFullYear();

    await leaveRequest.save();
    res.status(200).json(leaveRequest);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete a leave request
export const deleteLeaveRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id; // Set by authenticateToken middleware
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      res.status(404).json({ message: "Leave request not found" });
      return;
    }

    if (leaveRequest.employeeId.toString() !== employeeId) {
      res.status(403).json({ message: "Unauthorized: You can only delete your own leave requests" });
      return;
    }

    if (leaveRequest.status !== "Pending") {
      res.status(400).json({ message: "Cannot delete a leave request that is already approved or rejected" });
      return;
    }

    await LeaveRequest.deleteOne({ _id: id });
    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get employee's leave requests
export const getMyLeaveRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id; // Set by authenticateToken middleware

    const leaveRequests = await LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get employee's leave balance
export const getLeaveBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.id; // Set by authenticateToken middleware

    const currentYear = new Date().getFullYear();
    const leaveRequests = await LeaveRequest.find({
      employeeId,
      year: currentYear,
      status: "Approved", // Only count approved leaves
    });

    let totalLeavesTaken = 0;
    for (const request of leaveRequests) {
      const leaveDays = calculateLeaveDays(request.startDate, request.endDate);
      totalLeavesTaken += leaveDays;
    }

    const LEAVE_LIMIT = 21;
    const remainingLeaves = Math.max(0, LEAVE_LIMIT - totalLeavesTaken);

    const response: LeaveBalanceResponse = {
      totalLeavesTaken,
      remainingLeaves,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get all leave requests (admin route, authorization handled by middleware)
export const getAllLeaveRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate<{ employeeId: IStaffMember }>("employeeId", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json(leaveRequests);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Update leave request status (admin route, authorization handled by middleware)
export const updateLeaveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'" });
      return;
    }

    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      res.status(404).json({ message: "Leave request not found" });
      return;
    }

    if (leaveRequest.status !== "Pending") {
      res.status(400).json({ message: "Can only update status of pending requests" });
      return;
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    res.status(200).json(leaveRequest);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Generate and download leave report for an employee (admin route, authorization handled by middleware)
export const generateLeaveReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const leaveRequests = await LeaveRequest.find({ employeeId })
      .populate<{ employeeId: IStaffMember }>("employeeId", "fullName")
      .sort({ createdAt: -1 });

    if (!leaveRequests.length) {
      res.status(404).json({ message: "No leave requests found for this employee" });
      return;
    }

    const employeeName = leaveRequests[0].employeeId.fullName;

    // Create a PDF document
    const doc = new PDFDocument();
    const stream = new PassThrough();
    doc.pipe(stream);

    // Add title
    doc.fontSize(20).text(`Leave Report for ${employeeName}`, { align: "center" });
    doc.moveDown();

    // Add leave requests
    doc.fontSize(14).text("Leave Requests:", { underline: true });
    doc.moveDown(0.5);

    leaveRequests.forEach((request, index) => {
      doc.fontSize(12).text(`Request ${index + 1}:`);
      doc.fontSize(10).text(`Leave Type: ${request.leaveType}`);
      doc.text(
        `Duration: ${new Date(request.startDate).toLocaleDateString()} - ${new Date(
          request.endDate
        ).toLocaleDateString()} (${calculateLeaveDays(
          request.startDate,
          request.endDate
        )} days)`
      );
      doc.text(`Reason: ${request.reason}`);
      doc.text(`Status: ${request.status}`);
      if (request.attachmentUrl) {
        doc.text(`Proof Document: ${request.attachmentUrl}`, {
          link: request.attachmentUrl,
          underline: true,
        });
      } else {
        doc.text("Proof Document: None");
      }
      doc.moveDown();
    });

    // Finalize the PDF
    doc.end();

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Leave_Report_${employeeName}.pdf`
    );

    // Stream the PDF to the response
    stream.pipe(res);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};