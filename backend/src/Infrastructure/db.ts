import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {

    const uri = process.env.MONGO_URI;

    try {
        const connectionString = `${uri}`;
        await mongoose.connect(connectionString);
        console.log("DB connections successful!");
    } catch (error) {
        console.log("DB connections faild!");
    }

}

