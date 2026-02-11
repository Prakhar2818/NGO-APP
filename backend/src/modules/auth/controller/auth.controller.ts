// Auth Controller
import { Request, Response } from "express";
import User from "../models/user.model.js";
import { generateToken } from "../../../utils/jwt.js";
import { generateOtp } from "../../../utils/otp.js";
import { sendEmail } from "../../../utils/email.js";

import {
  recordFailure,
} from "../middleware/loginLock.middleware.js";

// Helper function to set token cookie
const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      recordFailure(email);
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

  
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successfull",
      role: user.role,
      profileCompleted: user.profileCompleted,
      isBlocked: user.isBlocked,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

// Refresh Token
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, role } = req.user!;

    const newToken = generateToken({
      userId,
      role,
    });

    setTokenCookie(res, newToken);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

// Current User
export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.user!;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      role: user.role,
      profileCompleted: user.profileCompleted,
      isBlocked: user.isBlocked,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
};

//Forgot Password
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        succes: false,
        message: "User not found",
      });
      return;
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Dear User,

We received a request to reset the password associated with your account.

Please use the **6-digit One-Time Password (OTP)** provided below to proceed with resetting your password:

OTP: ${otp}
This OTP is valid for the next **10 minutes**.
For security reasons, please do not share this OTP with anyone.

If you did not request a password reset, please ignore this email or contact our support team immediately.

Thank you for your cooperation.

Regards,
Prakhar Attarde
Support Team
NGO App
`,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to send otp",
    });
  }
};

// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
      });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    if (Date.now() > user.otpExpiry) {
      res.status(400).json({
        success: false,
        message: "OTP expired",
      });
      return;
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Password reset failed",
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
