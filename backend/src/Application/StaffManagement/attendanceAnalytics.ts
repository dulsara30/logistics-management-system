import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";
import Attendance from "../../Infrastructure/schemas/attendance";
import dayjs from "dayjs";
import PDFDocument from "pdfkit";

// Define the response type for attendance analytics
interface AttendanceAnalyticsResponse {
  totalEmployees: number;
  lateArrivalsToday: number;
  dailySummary: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
  }>;
}

// Define the response type for employee-wise details
interface EmployeeDetailsResponse {
  nic: string;
  name: string;
  attendance: Array<{
    date: string;
    checkIn: Date | null;
    checkOut: Date | null;
    status: string;
    overtimeHours: number;
  }>;
}

// Define the response type for today's stats
interface TodayStatsResponse {
  totalAttendance: number;
  totalAbsents: number;
}

// Fetch attendance analytics (total employees, late arrivals, daily summary)
export const getAttendanceAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get total employees
    const totalEmployees = await staffMembers.countDocuments({ status: "Active" });

    // 2. Get late arrivals for today
    const today = dayjs().format("YYYY-MM-DD");
    const lateArrivalsToday = await Attendance.countDocuments({
      date: today,
      isLate: true,
    });

    // 3. Get daily summary for the last 5 days
    const lastFiveDays = Array.from({ length: 5 }, (_, i) =>
      dayjs().subtract(i, "day").format("YYYY-MM-DD")
    );

    const attendanceRecords = await Attendance.find({
      date: { $in: lastFiveDays },
    });

    const allStaff = await staffMembers.find({ status: "Active" }).select("NIC");
    const allNics = allStaff.map((staff) => staff.NIC);

    const dailySummary = lastFiveDays.map((date) => {
      const recordsForDate = attendanceRecords.filter((rec) => rec.date === date);
      const present = recordsForDate.filter((rec) => rec.checkInTime && !rec.isLate).length;
      const late = recordsForDate.filter((rec) => rec.checkInTime && rec.isLate).length;
      const absent = allNics.length - recordsForDate.length;

      return {
        date,
        present,
        absent,
        late,
      };
    });

    const response: AttendanceAnalyticsResponse = {
      totalEmployees,
      lateArrivalsToday,
      dailySummary,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Fetch employee-wise attendance details
export const getEmployeeDetails = async (req: Request, res: Response): Promise<void> => {
  const search = req.query.search ? String(req.query.search) : undefined; // Safely cast to string

  try {
    // Get all active staff
    let staffQuery: { status: string; $or?: Array<{ [key: string]: { $regex: string; $options: string } }> } = { status: "Active" };
    if (search) {
      staffQuery = {
        ...staffQuery,
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { NIC: { $regex: search, $options: "i" } },
        ],
      };
    }

    const staff = await staffMembers.find(staffQuery).select("NIC fullName");

    // Get the last 5 days' dates
    const lastFiveDays = Array.from({ length: 5 }, (_, i) =>
      dayjs().subtract(i, "day").format("YYYY-MM-DD")
    );

    // Fetch attendance records for the last 5 days
    const attendanceRecords = await Attendance.find({
      date: { $in: lastFiveDays },
    });

    // Map staff to their attendance details
    const employeeDetails: EmployeeDetailsResponse[] = staff.map((employee) => {
      const employeeAttendance = lastFiveDays.map((date) => {
        const record = attendanceRecords.find(
          (rec) => rec.nic === employee.NIC && rec.date === date
        );
        let status = "Absent";
        let overtimeHours = 0;
        if (record && record.checkInTime) {
          status = record.isLate ? "Late" : "Present";
          overtimeHours = record.overTimeHours || 0;
        }
        return {
          date,
          checkIn: record && record.checkInTime ? record.checkInTime : null,
          checkOut: record && record.checkOutTime ? record.checkOutTime : null,
          status,
          overtimeHours,
        };
      });

      return {
        nic: employee.NIC,
        name: employee.fullName,
        attendance: employeeAttendance,
      };
    });

    res.status(200).json(employeeDetails);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Generate and download PDF report
export const exportAttendancePDF = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the last 5 days' dates
    const lastFiveDays = Array.from({ length: 5 }, (_, i) =>
      dayjs().subtract(i, "day").format("YYYY-MM-DD")
    );

    // Fetch all active staff
    const staff = await staffMembers.find({ status: "Active" }).select("NIC fullName");

    // Fetch attendance records for the last 5 days
    const attendanceRecords = await Attendance.find({
      date: { $in: lastFiveDays },
    });

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    const filename = "attendance-report.pdf";

    // Set response headers for PDF download
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text("Attendance Report", { align: "center" });
    doc.moveDown();

    // Add summary
    doc.fontSize(14).text("Summary (Last 5 Days)", { underline: true });
    doc.moveDown(0.5);

    const allNics = staff.map((s) => s.NIC);
    lastFiveDays.forEach((date) => {
      const recordsForDate = attendanceRecords.filter((rec) => rec.date === date);
      const present = recordsForDate.filter((rec) => rec.checkInTime && !rec.isLate).length;
      const late = recordsForDate.filter((rec) => rec.checkInTime && rec.isLate).length;
      const absent = allNics.length - recordsForDate.length;

      doc.fontSize(12).text(`Date: ${date}`);
      doc.text(`Present: ${present}`);
      doc.text(`Late: ${late}`);
      doc.text(`Absent: ${absent}`);
      doc.moveDown();
    });

    // Add employee-wise details
    doc.fontSize(14).text("Employee-wise Attendance", { underline: true });
    doc.moveDown(0.5);

    staff.forEach((employee) => {
      doc.fontSize(12).text(`Employee: ${employee.fullName} (NIC: ${employee.NIC})`);
      doc.moveDown(0.5);

      lastFiveDays.forEach((date) => {
        const record = attendanceRecords.find(
          (rec) => rec.nic === employee.NIC && rec.date === date
        );
        let status = "Absent";
        let checkIn = "N/A";
        let checkOut = "N/A";
        let overtime = "0 hrs";

        if (record && record.checkInTime) {
          status = record.isLate ? "Late" : "Present";
          checkIn = dayjs(record.checkInTime).format("hh:mm A");
          checkOut = record.checkOutTime ? dayjs(record.checkOutTime).format("hh:mm A") : "N/A";
          overtime = record.overTimeHours ? `${record.overTimeHours.toFixed(1)} hrs` : "0 hrs";
        }

        doc.fontSize(10).text(`Date: ${date}`);
        doc.text(`Status: ${status}`);
        doc.text(`Check-In: ${checkIn}`);
        doc.text(`Check-Out: ${checkOut}`);
        doc.text(`Overtime: ${overtime}`);
        doc.moveDown(0.5);
      });

      doc.moveDown();
    });

    // Finalize the PDF
    doc.end();
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Fetch today's attendance stats (total attendance and total absents)
export const getTodayStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get total active employees
    const totalEmployees = await staffMembers.countDocuments({ status: "Active" });

    // 2. Get total attendance for today (employees who checked in)
    const today = dayjs().format("YYYY-MM-DD");
    const totalAttendance = await Attendance.countDocuments({
      date: today,
      checkInTime: { $exists: true }, // Employees who have checked in
    });

    // 3. Calculate total absents
    const totalAbsents = totalEmployees - totalAttendance;

    const response: TodayStatsResponse = {
      totalAttendance,
      totalAbsents,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};