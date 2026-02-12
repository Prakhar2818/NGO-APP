import { Request, Response, NextFunction } from "express";
import logger, { logToSchema } from "../utils/logger.js";

const errorLogger = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logData = {
    level: "error" as const,
    message: err.message,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  };

  logger.error(logData);

  await logToSchema(logData);

  res.status(500).json({
    success: false,
    message: "Server Error",
  });

  next();
};

export default errorLogger;