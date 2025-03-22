// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Thisaru:Thisaru@itp.foj9t.mongodb.net/?retryWrites=true&w=majority&appName=ITP");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
