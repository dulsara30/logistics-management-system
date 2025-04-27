import mongoose from "mongoose";

const AttendanceSchema =  new mongoose.Schema({
    nic: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    checkInTime: { 
        type: Date 
    },
    checkOutTime: { 
        type: Date 
    },
    isLate: { 
        type: Boolean, default: false 
    },
    overTimeHours: { 
        type: Number, default: 0 
    },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
