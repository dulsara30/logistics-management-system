import { Request, Response } from "express";
import { checkInEmployee, checkOutEmployee } from "./attendance";

// Define the response type for the frontend
interface AttendanceApiResponse {
  status: string;
  checkInTime: Date;
}

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  const { nic, mode } = req.body;

  if (!nic || !mode) {
    res.status(400).json({ message: "NIC and mode are required" });
    return;
  }

  try {
    let result: { success: boolean; message: string; data?: any };
    if (mode === "checkIn") {
      result = await checkInEmployee(nic);
    } else if (mode === "checkOut") {
      result = await checkOutEmployee(nic);
    } else {
      res.status(400).json({ message: "Invalid mode" });
      return;
    }

    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }

    // Determine status
    const attendance = result.data;
    let status = "Absent";
    if (attendance.checkInTime) {
      status = attendance.isLate ? "Late" : "Present";
    }

    const response: AttendanceApiResponse = {
      status,
      checkInTime: attendance.checkInTime,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};