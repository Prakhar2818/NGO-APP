import winston from "winston";
import Log, { ILog } from "../models/logger.model.js";

const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  transports: [new winston.transports.Console()],
});

export const logToSchema = async (data: Partial<ILog>): Promise<void> => {
  try {
    await Log.create(data);
  } catch (error) {
    console.error("Log Save Error:", error);
  }
};

export default logger;
