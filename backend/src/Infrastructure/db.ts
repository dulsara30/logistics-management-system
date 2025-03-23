import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {

    

    try{
        
        const connectionString = process.env.MONGODB_URI;
        /*if(!uri){
            throw new Error("Please add the connection string")
        }*/
        await mongoose.connect("mongodb+srv://dulsara:200336513393@logistics-management-sy.zxqm3.mongodb.net/?retryWrites=true&w=majority&appName=Logistics-Management-System");
        console.log("DB connections successful!");
    }catch (error){
        console.log("DB connections failed!");
        console.log(error);
    }

}