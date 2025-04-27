<<<<<<< HEAD
import 
=======
import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";
import Attendance from "../../Infrastructure/schemas/attendance";
import dayjs from "dayjs";

// Define the response type
interface DashboardResponse {
  qrCode: string;
  attendanceRecords: Array<{
    date: string;
    checkIn: Date | null;
    checkOut: Date | null;
    status: string;
    overTimeHours: number;
  }>;
}

export const fetchQRCodeAndData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user from the request (set by authenticateToken middleware)
    const user = req.user as unknown as { email: string };
    if (!user || !user.email) {
      res.status(401).json({ message: "Unauthorized: User not found in token" });
      return;
    }

    // Find the staff member by email
    const staff = await staffMembers.findOne({ email: user.email });
    if (!staff) {
      res.status(404).json({ message: "Staff member not found" });
      return;
    }

    // Get the last 5 days' dates
    const today = dayjs();
    const lastFiveDays = Array.from({ length: 5 }, (_, i) =>
      today.subtract(i, "day").format("YYYY-MM-DD")
    );

    // Fetch attendance records for the last 5 days
    const attendanceRecords = await Attendance.find({
      nic: staff.NIC,
      date: { $in: lastFiveDays },
    }).sort({ date: -1 }); // Sort by date descending (most recent first)

    // Map attendance records to the format expected by the frontend
    const formattedRecords: DashboardResponse["attendanceRecords"] = lastFiveDays.map((date) => {
      const record = attendanceRecords.find((rec) => rec.date === date);
      let status = "Absent";
      let overTimeHours = 0;
      if (record && record.checkInTime) {
        status = record.isLate ? "Late" : "Present";
        overTimeHours = record.overTimeHours || 0;
      }
      return {
        date,
        checkIn: record && record.checkInTime ? record.checkInTime : null,
        checkOut: record && record.checkOutTime ? record.checkOutTime : null,
        status,
        overTimeHours,
      };
    });

    // Prepare the response
    const response: DashboardResponse = {
      qrCode: staff.qrCode || "",
      attendanceRecords: formattedRecords,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
>>>>>>> staff-management
