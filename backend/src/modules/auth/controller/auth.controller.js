// Auth Controller

import User from "../models/user.model.js";
import { generateToken } from "../../../utils/jwt.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
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

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successfull",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const newToken = generateToken({
      userId,
      role,
    });

    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};
