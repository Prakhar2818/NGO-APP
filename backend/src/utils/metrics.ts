import client from "prom-client";

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

// API Requests
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total API Requests",
  labelNames: ["method", "route", "status"] as const,
});

// API Errors
export const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total API Errors",
  labelNames: ["method", "route", "status"] as const,
});

// API Response time
export const httpResponseTime = new client.Histogram({
  name: "http_response_time_seconds",
  help: "API response time",
  labelNames: ["method", "route", "status"] as const,
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpErrorsTotal);
register.registerMetric(httpResponseTime);
