// User Schema

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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
    documnets: {
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
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Password Hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparision during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
