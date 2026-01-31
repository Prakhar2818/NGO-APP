import { Request, Response } from "express";
import { Donation, DonationStatus } from "../models/donation.model.js";
import mongoose from "mongoose";

/* Restaurant: Create */
export const createDonation = async (req: Request, res: Response) => {
  const donation = await Donation.create({
    ...req.body,
    restaurantId: req.user!.userId,
  });

  res.status(201).json({ success: true, donation });
};

/* Restaurant: Update */
export const updateDonation = async (req: Request, res: Response) => {
  Object.assign(req.donation!, req.body);
  await req.donation!.save();

  res.json({
    success: true,
    donation: req.donation,
  });
};

/* Restaurant: Delete */
export const deleteDonation = async (req: Request, res: Response) => {
  await req.donation!.deleteOne();
  res.json({ success: true, message: "Donation deleted" });
};

/* Restaurant Dashboard */
export const restaurantDashboard = async (req: Request, res: Response) => {
  const donations = await Donation.find({
    restaurantId: req.user!.userId,
  }).populate("ngoId", "name");

  const mealsSaved = donations.reduce((sum, d) => sum + d.quantity * 2, 0);

  res.json({
    success: true,
    totalDonations: donations.length,
    mealsSaved,
    donations,
  });
};

/* NGO: Browse */
export const browseDonations = async (req: Request, res: Response) => {
  const { foodType, maxHours } = req.query;

  const filter: any = {
    status: DonationStatus.PENDING,
  };

  if (foodType) {
    filter.foodType = foodType;
  }

  if (maxHours) {
    const now = new Date();
    const futureTime = new Date(
      now.getTime() + Number(maxHours) * 60 * 60 * 1000,
    );

    filter.expiryTime = {
      $gte: now,
      $lte: futureTime,
    };
  }

  const donations = await Donation.find(filter)
    .populate("restaurantId", "name restaurantName address")
    .sort({ createdAt: -1 });

  const formattedDonations = donations.map((donation: any) => {
    const restaurant = donation.restaurantId;

    return {
      ...donation.toObject(),
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName || restaurant.name,
        address: restaurant.address,
      },
    };
  });

  res.json({
    success: true,
    donations: formattedDonations,
  });
};

/* NGO: Accept */
export const acceptDonation = async (req: Request, res: Response) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation || donation.status !== DonationStatus.PENDING) {
    return res.status(400).json({ message: "Cannot accept donation" });
  }

  donation.status = DonationStatus.ACCEPTED;
  donation.ngoId = new mongoose.Types.ObjectId(req.user!.userId);
  donation.acceptedAt = new Date();

  await donation.save();

  res.json({ success: true, donation });
};

// Pickup status

export const markPickedUp = async (req: Request, res: Response) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return res.status(404).json({ message: "Donation not found" });
  }

  if (donation.status !== DonationStatus.ACCEPTED) {
    return res.status(400).json({
      message: "Only accepted donations can be picked up",
    });
  }

  // NGO ownership check (important)
  if (donation.ngoId?.toString() !== req.user!.userId) {
    return res.status(403).json({
      message: "Not authorized to pick up this donation",
    });
  }

  donation.status = DonationStatus.PICKED_UP;
  donation.pickedUpAt = new Date();

  await donation.save();

  res.json({
    success: true,
    message: "Donation marked as picked up",
    donation,
  });
};

/* NGO History */
export const ngoHistory = async (req: Request, res: Response) => {
  const donations = await Donation.find({
    ngoId: req.user!.userId,
  })
    .populate("restaurantId", "name restaurantName address")
    .sort({ acceptedAt: -1 });

  const formattedDonations = donations.map((donation: any) => {
    const restaurant = donation.restaurantId;

    return {
      ...donation.toObject(),
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName || restaurant.name,
        address: restaurant.address,
      },
    };
  });

  res.json({
    success: true,
    donations: formattedDonations,
  });
};
