import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if(!DB_URI){
    throw new Error("Database URI is not defined in environment variables.");
}

const connectDB = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB successfully.");
    }catch(error){
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;