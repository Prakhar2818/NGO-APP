import { Schema, model, Types, Document } from "mongoose";

export enum DonationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
}

export interface IDonation extends Document {
  foodName: string;
  quantity: number;
  expiryTime: Date;
  pickupAddress: string;
  foodType?: string;

  status: DonationStatus;

  restaurantId: Types.ObjectId;
  ngoId?: Types.ObjectId;

  organizationName?: string;

  acceptedAt?: Date;
  pickedUpAt?: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryTime: { type: Date, required: true },
    pickupAddress: { type: String, required: true },
    foodType: String,

    status: {
      type: String,
      enum: Object.values(DonationStatus),
      default: DonationStatus.PENDING,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ngoId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    organizationName: {
      type: String,
      trim: true,
    },
    acceptedAt: Date,
    pickedUpAt: Date,
  },
  { timestamps: true },
);

export const Donation = model<IDonation>("Donation", DonationSchema);
