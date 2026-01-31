import { Request, Response, NextFunction } from "express";
import { Donation } from "../models/donation.model.js";
import { IDonation } from "../models/donation.model.js";

declare module "express-serve-static-core" {
  interface Request {
    donation?: IDonation;
  }
}

export const donationOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return res.status(404).json({
      success: false,
      message: "Donation not found",
    });
  }

  if (donation.restaurantId.toString() !== req.user!.userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }

  req.donation = donation;
  next();
};
