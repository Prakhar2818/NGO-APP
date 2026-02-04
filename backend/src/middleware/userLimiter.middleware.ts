import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,

  keyGenerator: (req: any) => req.user?.userId || ipKeyGenerator(req.ip),
});
