import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

export const forgotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
});
