import { z } from "zod";

const emailFormat = z
  .string()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format");

export const registerSchema = z.object({
  name: z.string().min(2),
  email: emailFormat,
  password: z.string().min(6),
  role: z.enum(["NGO", "RESTAURANT", "ADMIN"]),
});

export const loginSchema = z.object({
  email: emailFormat,
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: emailFormat,
});

export const resetPasswordSchema = z.object({
  email: emailFormat,
  otp: z.string().length(6),
  newPassword: z.string().min(6),
});

export const completeRegistrationSchema = z.object({
  organizationName: z
    .string()
    .refine((val) => val && val.trim().length > 0, {
      message: "Organization name required",
    }),

  address: z
    .string()
    .refine((val) => val && val.trim().length >= 5, {
      message: "Address is required",
    }),
});
