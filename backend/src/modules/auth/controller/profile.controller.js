import User from "../models/user.model.js";
import { uploadTosupabase } from "../../../utils/uploadToSupabase.js";

export const completeProfile = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
        if (!files[doc]) {
          res.status(400).json({
            success: false,
            message: `${doc} is required for NGO`,
          });

          uploadDocs[doc] = await uploadTosupabase(
            files[doc][0],
            "ngo",
            userId,
          );
        }
        user.documnets.ngo = uploadedDocs;
      }
    }

    if (role === "RESTAURANT") {
      if (!files.fssaiLicense) {
        retrun.res.status(400).json({
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

      for (const fields of docFields) {
        if (files[files]) {
          uploadDocs[fields] = await uploadTosupabase(
            files[files][0],
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
