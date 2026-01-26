import { z } from "zod";

const emailFormat = z
  .string()
  .min(2, "Email Required")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format");

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: emailFormat,
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["NGO", "RESTAURANT", "ADMIN"])
    .refine(
      (val) => ["NGO", "RESTAURANT", "ADMIN"].includes(val),
      "Invalid role selected",
    ),
});

export const loginSchema = z.object({
  email: emailFormat,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: emailFormat,
});

export const resetPasswordSchema = z.object({
  email: emailFormat,
  otp: z.string().min(6, "OTP required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const completeRegistrationSchema = (req) => {
  const role = req.user.role;
  const baseSchema = {
    address: z.string().min(1, "Address Required"),
  };

  if (role === "NGO") {
    baseSchema.organizationName = z
      .string()
      .min(2, "Organization name required");
  } else if (role === "RESTAURANT") {
    baseSchema.restaurantName = z.string().min(2, "Restuarant name required");
  }

  return z.object(baseSchema);
};
