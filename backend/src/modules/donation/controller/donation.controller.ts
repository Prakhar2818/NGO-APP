import { Request, Response } from "express";
import mongoose from "mongoose";
import { Donation, DonationStatus } from "../models/donation.model.js";
import { emitNewDonation } from "../../../socket.js";
import User from "../../auth/models/user.model.js";
import { sendEmail } from "../../../utils/email.js";

// Create Donations
export const createDonation = async (req: Request, res: Response) => {
  try {
    const { lat, lng, ...rest } = req.body;
    const donation = await Donation.create({
      ...rest,
      restaurantId: req.user!.userId,

      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    emitNewDonation({
      id: donation._id,
      foodName: donation.foodName,
      quantity: donation.quantity,
      expiryTime: donation.expiryTime,
      foodType: donation.foodType,
    });

    const ngos = await User.find({ role: "NGO" }).select("email name");
    const restaurtant = await User.findById(req.user!.userId).select(
      "restaurantName name",
    );

    const subject = "New Food Donation Available";

    const text = `
Hi,

New Donation available by ${restaurtant?.restaurantName || restaurtant?.name || "Restaurant"}

Donation Details:
Food Name: ${donation.foodName}
Quantity: ${donation.quantity}
Food Type: ${donation.foodType}
Expiry Time: ${donation.expiryTime}

Please login to your dashboard to accept this donation.

Thank You,
NGO Food
`;

    if (ngos.length > 0) {
      Promise.all(
        ngos.map((ngo) => {
          sendEmail({
            to: ngo.email,
            subject,
            text,
          });
        }),
      ).catch((err) => console.error("Failed to send donation emails:", err));
    }

    return res.status(201).json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error("Create Donation Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Donation Update
export const updateDonation = async (req: Request, res: Response) => {
  try {
    if (!req.donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    Object.assign(req.donation, req.body);
    await req.donation.save();

    return res.json({
      success: true,
      donation: req.donation,
    });
  } catch (error) {
    console.error("Update Donation Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Donation
export const deleteDonation = async (req: Request, res: Response) => {
  try {
    if (!req.donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    await req.donation.deleteOne();

    return res.json({
      success: true,
      message: "Donation deleted",
    });
  } catch (error) {
    console.error("Delete Donation Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Restaurant dashboard
export const restaurantDashboard = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find({
      restaurantId: req.user!.userId,
    }).populate("ngoId", "name organizationName");

    const mealsSaved = donations.reduce((sum, d) => sum + d.quantity * 2, 0);

    const formatted = donations.map((donation: any) => {
      const ngo = donation.ngoId;
      return {
        ...donation.toObject(),
        ngo: ngo
          ? {
              id: ngo._id,
              organizationName: ngo.organizationName || ngo.name,
            }
          : null,
      };
    });

    return res.json({
      success: true,
      totalDonations: donations.length,
      mealsSaved,
      donations: formatted,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Browse donations
export const browseDonations = async (req: Request, res: Response) => {
  try {
    const { lat, lng, foodType, maxHours } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat/lng required" });
    }

    const now = new Date();

    const match: any = {
      status: DonationStatus.PENDING,
    };

    if (foodType) match.foodType = foodType;

    if (maxHours) {
      const future = new Date(
        now.getTime() + Number(maxHours) * 60 * 60 * 1000,
      );

      match.expiryTime = {
        $gte: now,
        $lte: future,
      };
    }

    // Geo Query
    const donations = await Donation.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distance",
          spherical: true,
        },
      },
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
    ]);

    return res.json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error("Browse Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Accept donation
export const acceptDonation = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation || donation.status !== DonationStatus.PENDING) {
      return res.status(400).json({
        message: "Cannot accept donation",
      });
    }

    donation.status = DonationStatus.ACCEPTED;
    donation.ngoId = new mongoose.Types.ObjectId(req.user!.userId);
    donation.acceptedAt = new Date();

    await donation.save();

    return res.json({ success: true, donation });
  } catch (error) {
    console.error("Accept Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Mark pickup
export const markPickedUp = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== DonationStatus.ACCEPTED) {
      return res.status(400).json({
        message: "Only accepted donations can be picked up",
      });
    }

    if (donation.ngoId?.toString() !== req.user!.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    donation.status = DonationStatus.PICKED_UP;
    donation.pickedUpAt = new Date();

    await donation.save();

    return res.json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error("Pickup Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// NGO history
export const ngoHistory = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find({
      ngoId: req.user!.userId,
    })
      .populate("restaurantId", "name restaurantName address")
      .sort({ acceptedAt: -1 });

    const formatted = donations.map((donation: any) => {
      const r = donation.restaurantId;

      return {
        ...donation.toObject(),
        restaurant: {
          id: r._id,
          name: r.restaurantName || r.name,
          address: r.address,
        },
      };
    });

    return res.json({
      success: true,
      donations: formatted,
    });
  } catch (error) {
    console.error("History Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
