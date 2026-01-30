// DB connection
import mongoose from "mongoose";
import { env } from "./env.js";
const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        process.exit(1);
    }
};
export default connectDB;
