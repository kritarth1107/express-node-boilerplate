import mongoose from "mongoose";
import config from "./app.config.js";

/**
 * ✅ Connects to MongoDB with error handling.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(config.database.uri); // No need for deprecated options
        console.log("✅ MongoDB Connected Successfully.");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process if DB connection fails
    }
};

/**
 * ✅ Closes MongoDB connection gracefully on server shutdown.
 */
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log("📡 MongoDB connection closed.");
    } catch (error) {
        console.error("❌ Error closing MongoDB connection:", error);
    }
};

export { connectDB, closeDB };
