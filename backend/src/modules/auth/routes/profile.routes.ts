import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { completeProfile } from "../controller/profile.controller.js";
import { completeRegistrationSchema } from "../validations/auth.validation.js";

import { uploadRateLimiter } from "../middleware/uploadLimiter.middleware.js";
import { concurrencyUploadLimiter } from "../middleware/concurrencyLimiter.middleware.js";

const router = Router();

router.post(
  "/complete-registration",
  protect,
  uploadRateLimiter,
  concurrencyUploadLimiter,
  upload.fields([
    { name: "registrationCertificate" },
    { name: "panCard" },
    { name: "addressProof" },
    { name: "bankProof" },
    { name: "authorizedPersonId" },
    { name: "fssaiLicense" },
    { name: "gstCertificate" },
    { name: "businessRegistration" },
    { name: "ownerId" },
  ]),
  validate(completeRegistrationSchema),
  completeProfile,
);

export default router;
