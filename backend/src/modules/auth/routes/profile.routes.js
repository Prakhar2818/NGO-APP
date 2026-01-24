import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { completeProfile } from "../controller/profile.controller.js";

const router = express.Router();

router.post(
  "/complete-registration",
  protect,
  upload.fields([
    { name: "registrationCertificate" },
    { name: "panCard" },
    { name: "addressProof" },
    { name: "bankProof" },
    { name: "authorizedPersonId" },

    { name: "fssaiLicense" },
    { name: "gstCertificate" },
    { name: "businessRegistration" },
    { name: "panCard" },
    { name: "addressProof" },
    { name: "ownerId" },
  ]),
  completeProfile,
);

export default router;
