import { Router } from "express";
import { protect } from "../../auth/middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { donationOwnership } from "../middleware/donationOwnership.middleware.js";
import { allowOnlyPending } from "../middleware/status.middleware.js";
import { createDonationSchema } from "../validations/createDonation.schema.js";
import {
  createDonation,
  updateDonation,
  deleteDonation,
  restaurantDashboard,
  browseDonations,
  acceptDonation,
  ngoHistory,
  markPickedUp,
} from "../controller/donation.controller.js";

import { userLimiter } from "../../../middleware/userLimiter.middleware.js";

const router = Router();
router.use(userLimiter);

// Restaurant
router.post(
  "/create-donation",
  protect,
  roleMiddleware("RESTAURANT"),
  validate(createDonationSchema),
  createDonation,
);
router.patch(
  "/:id",
  protect,
  roleMiddleware("RESTAURANT"),
  donationOwnership,
  allowOnlyPending,
  updateDonation,
);
router.delete(
  "/:id",
  protect,
  roleMiddleware("RESTAURANT"),
  donationOwnership,
  allowOnlyPending,
  deleteDonation,
);
router.get(
  "/restaurant/dashboard",
  protect,
  roleMiddleware("RESTAURANT"),
  restaurantDashboard,
);

// NGO
router.get("/browse", protect, roleMiddleware("NGO"), browseDonations);
router.post("/:id/accept", protect, roleMiddleware("NGO"), acceptDonation);
router.patch("/:id/pickup", protect, roleMiddleware("NGO"), markPickedUp);
router.get("/ngo/history", protect, roleMiddleware("NGO"), ngoHistory);

export default router;
