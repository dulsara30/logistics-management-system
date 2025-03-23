import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const connectionString = "mongodb+srv://tulip:kavyy@cluster0.il8ec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        await mongoose.connect(connectionString);
        console.log("Db connection is successful!");
       } catch (error){
        console.log("Db connection is failed!");
       }
 
}