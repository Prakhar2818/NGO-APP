import User from "../models/user.model.js";
import { uploadTosupabase } from "../../../utils/uploadToSupabase.js";

export const completeProfile = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update profile data
    if (role === "NGO") {
      user.organizationName = req.body.organizationName;
    } else if (role === "RESTAURANT") {
      user.organizationName = req.body.restaurantName;
    }
    user.address = req.body.address;
    user.phone = req.body.phone;

    const files = req.files;

    const uploadedDocs = {};

    if (role === "NGO") {
      const requiredDocs = [
        "registrationCertificate",
        "panCard",
        "addressProof",
        "bankProof",
        "authorizedPersonId",
      ];

      for (const doc of requiredDocs) {
        if (!files[doc] || !files[doc][0]) {
          return res.status(400).json({
            success: false,
            message: `${doc} is required for NGO`,
          });
        }
        uploadedDocs[doc] = await uploadTosupabase(
          files[doc][0],
          "ngo",
          userId,
        );
      }
      user.documnets.ngo = uploadedDocs;
    }

    if (role === "RESTAURANT") {
      if (!files.fssaiLicense || !files.fssaiLicense[0]) {
        return res.status(400).json({
          success: false,
          message: "FSSAI License is mandatory for restaurant",
        });
      }

      const docFields = [
        "fssaiLicense",
        "gstCertificate",
        "businessRegistration",
        "panCard",
        "addressProof",
        "ownerId",
      ];

      for (const field of docFields) {
        if (files[field] && files[field][0]) {
          uploadedDocs[field] = await uploadTosupabase(
            files[field][0],
            "restaurant",
            userId,
          );
        }
      }
      user.documnets.restaurant = uploadedDocs;
    }

    user.profileCompleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Registration completed successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
