import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req: any) => req.user?.userId || ipKeyGenerator(req.ip),
});
