import mongoose from "mongoose";
import { DB_URI } from "./constants";

//connect to DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45s inactivity
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Event listeners
        mongoose.connection.on("error", (err) => {
            console.error("DB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
};

export default connectDB;
