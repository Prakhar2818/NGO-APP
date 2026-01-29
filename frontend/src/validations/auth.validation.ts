import * as yup from "yup";

// Email format
const emailFormat = yup
  .string()
  .required("Email required")
  .email("Invalid email format");

// Register Schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: emailFormat,

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  role: yup
    .string()
    .oneOf(["NGO", "RESTAURANT"], "Invalid role")
    .required("Role is required"),
});

// Login schema
export const loginSchema = yup.object({
  email: emailFormat,
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Forgot password schema
export const forgotPasswordSchema = yup.object({
  email: emailFormat,
});

// Reset schema
export const resetPasswordSchema = yup.object({
  email: emailFormat,
  otp: yup.string().required("OTP is required").min(6, "OTP must be 6 digits"),

  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
});
