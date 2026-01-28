// User Schema

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "RESTAURANT" | "NGO" | "ADMIN";

  organizationName?: string;
  restaurantName?: string;
  address?: string;
  phone?: number;

  profileCompleted: boolean;

  documents?: {
    ngo?: {
      registrationCertificate?: string;
      panCard?: string;
      addressProof?: string;
      bankProof?: string;
      authorizedPersonId?: string;
    };
    restaurant?: {
      fssaiLicense?: string;
      gstCertificate?: string;
      businessRegistration?: string;
      panCard?: string;
      addressProof?: string;
      ownerId?: string;
    };
  };

  otp?: string;
  otpExpiry?: number;

  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["RESTAURANT", "NGO", "ADMIN"],
      required: true,
    },
    organizationName: {
      type: String,
      trim: true,
    },
    restaurantName: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    documents: {
      ngo: {
        registrationCertificate: String,
        panCard: String,
        addressProof: String,
        bankProof: String,
        authorizedPersonId: String,
      },
      restaurant: {
        fssaiLicense: String,
        gstCertificate: String,
        businessRegistration: String,
        panCard: String,
        addressProof: String,
        ownerId: String,
      },
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

// Password Hashing
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparision during login
userSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
