import { Request, Response } from "express";
import User from "../../auth/models/user.model.js";
import { Donation } from "../../donation/models/donation.model.js";
import { generateToken } from "../../../utils/jwt.js";

// Get All Users

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({
      role: { $in: ["NGO", "RESTAURANT"] },
    }).select(
      "name email role organizationName restaurantName address isBlocked",
    );

    res.status(200).json({
      success: true,
      message: "Users Fetched",
      users,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Fetch failed",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
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
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "User creation failed",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      role,
      organizationName,
      restaurantName,
      address,
      phone,
    } = req.body;

    if (role && !["NGO", "RESTAURANT"].includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role",
      });
      return;
    }

    const update: any = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (role !== undefined) update.role = role;
    if (organizationName !== undefined) update.organizationName = organizationName;
    if (restaurantName !== undefined) update.restaurantName = restaurantName;
    if (address !== undefined) update.address = address;
    if (phone !== undefined) update.phone = phone;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "User updation failed",
    });
  }
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User Blocked" : "User Unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "User block failed",
    });
  }
};

export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const { status, restaurantId, ngoId, startDate, endDate } = req.query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    if (ngoId) {
      filter.ngoId = ngoId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const donations = await Donation.find(filter)
      .populate("restaurantId", "name restaurantName email")
      .populate("ngoId", "name organizationName email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Fetch failed",
    });
  }
};

export const donationSummary = async (_: Request, res: Response) => {
  try {
    const summary = await Donation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const total = summary.reduce((acc, cur) => acc + cur.count, 0);

    res.status(200).json({
      success: true,
      totalDonations: total,
      statusBreakdown: summary,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Summary fetch failed",
    });
  }
};

export const donationTrends = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    let format = "%Y-%m-%d";

    if (type === "monthly") {
      format = "%Y-%m";
    }

    if (type === "weekly") {
      format = "%Y-%U";
    }

    const trends = await Donation.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      type,
      trends,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Analytics fetch failed",
    });
  }
};
