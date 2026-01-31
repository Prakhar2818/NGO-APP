import { Request, Response, NextFunction } from "express";
import { DonationStatus } from "../models/donation.model.js";

export const allowOnlyPending = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.donation!.status !== DonationStatus.PENDING) {
    return res.status(400).json({
      message: "Action not allowed on this donation",
    });
  }
  next();
};
