import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,

  message: {
    success: false,
    message:
      "Too many registration attempts. Please try again after some time.",
  },
});
