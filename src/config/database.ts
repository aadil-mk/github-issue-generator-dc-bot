import mongoose from "mongoose";
import { ENV } from "./env";
import { logger } from "../utils/logger";

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGODB_URI);
        logger.info("Successfully connected to MongoDB");
    } catch (error) {
        logger.error("Database connection failed", error);
        process.exit(1); 
    }
};
