// Auth Routes

import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";

import {
  authRateLimiter,
  forgotLimiter,
} from "../middleware/authLImiter.middleware.js";
import { loginLockCheck } from "../middleware/loginLock.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post(
  "/login",
  loginLockCheck,
  authRateLimiter,
  validate(loginSchema),
  login,
);
router.get("/me", protect, getCurrentUser);
router.post("/refresh-token", protect, refreshToken);
router.post(
  "/forgot-password",
  forgotLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  authRateLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);

export default router;
