// DB connection

import mongoose from "mongoose";
import { env } from "./env.js";
import logger, { logToSchema } from "../utils/logger.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected successfully");
    logger.info("MongoDB connected successfully");
  } catch (error: any) {
    const logData = {
      level: "error" as const,
      message: "DB CONNECTION FAILED",
      stack: error.message,
    };

    logger.error(logData);

    await logToSchema(logData);

    process.exit(1);
  }

  mongoose.connection.on("error", async (err) => {
    const logData = {
      level: "error" as const,
      message: "MongoDB Runtime Error",
      stack: err.message,
    };

    logger.error(logData);
    await logToSchema(logData);
  });
  mongoose.connection.on("disconnected", async () => {
    const logData = {
      level: "warn" as const,
      message: "MongoDB Disconnected",
    };

    logger.warn(logData);
    await logToSchema(logData);
  });

  mongoose.connection.on("reconnected", async () => {
    const logData = {
      level: "info" as const,
      message: "MongoDB Reconnected",
    };

    logger.info(logData);
    await logToSchema(logData);
  });
};

export default connectDB;
