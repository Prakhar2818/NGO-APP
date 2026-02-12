import { Request, Response, NextFunction } from "express";
import logger, { logToSchema } from "../utils/logger.js";

const apiLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    const logData = {
      level: "info" as const,
      message: "API HIT",
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${duration}ms`,
    };

    logger.info(logData);
    await logToSchema(logData);
  });
  next();
};

export default apiLogger;