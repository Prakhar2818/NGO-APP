import { Request, Response, NextFunction } from "express";
import {
  httpRequestsTotal,
  httpErrorsTotal,
  httpResponseTime,
} from "../utils/metrics.js";

const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    const route = (req.route?.path || req.path) as string;

    const labels = {
      method: req.method,
      route,
      status: res.statusCode.toString(),
    };

    httpRequestsTotal.inc(labels);
    httpResponseTime.observe(labels, duration);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });

  next();
};

export default metricsMiddleware;