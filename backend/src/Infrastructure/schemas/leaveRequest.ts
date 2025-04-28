import mongoose, { Schema, Types } from "mongoose";

// Interface for StaffMembers (to type employeeId after population)
export interface IStaffMember {
  _id: Types.ObjectId;
  fullName: string;
}

// Interface for LeaveRequest document
export interface ILeaveRequest extends mongoose.Document {
  employeeId: Types.ObjectId | IStaffMember;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  attachmentUrl?: string | null;
  status: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "StaffMembers",
      required: [true, "Employee ID is required"],
    },
    leaveType: {
      type: String,
      enum: {
        values: ["Annual Leave", "Sick Leave", "Unpaid Leave"],
        message: "Leave type must be 'Annual Leave', 'Sick Leave', or 'Unpaid Leave'",
      },
      required: [true, "Leave type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason for leave is required"],
      trim: true,
      minlength: [5, "Reason must be at least 5 characters long"],
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: "Status must be 'Pending', 'Approved', or 'Rejected'",
      },
      default: "Pending",
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
  },
  { timestamps: true }
);

// Add validation to ensure startDate is before endDate
leaveRequestSchema.pre("save", function (next) {
  if (this.startDate > this.endDate) {
    next(new Error("Start date must be before end date"));
  } else {
    next();
  }
});

export default mongoose.model<ILeaveRequest>("LeaveRequest", leaveRequestSchema);