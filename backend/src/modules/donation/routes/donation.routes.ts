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

import { getRoute } from "../controller/route.controller.js";

import { userLimiter } from "../../../middleware/userLimiter.middleware.js";

const router = Router();
// Restaurant
router.post(
  "/create-donation",
  protect,
  userLimiter,
  roleMiddleware("RESTAURANT"),
  validate(createDonationSchema),
  createDonation,
);
router.patch(
  "/:id",
  protect,
  userLimiter,
  roleMiddleware("RESTAURANT"),
  donationOwnership,
  allowOnlyPending,
  updateDonation,
);
router.delete(
  "/:id",
  protect,
  userLimiter,
  roleMiddleware("RESTAURANT"),
  donationOwnership,
  allowOnlyPending,
  deleteDonation,
);
router.get(
  "/restaurant/dashboard",
  protect,
  userLimiter,
  roleMiddleware("RESTAURANT"),
  restaurantDashboard,
);

// NGO
router.get(
  "/browse",
  protect,
  userLimiter,
  roleMiddleware("NGO"),
  browseDonations,
);
router.post(
  "/:id/accept",
  protect,
  userLimiter,
  roleMiddleware("NGO"),
  acceptDonation,
);
router.patch(
  "/:id/pickup",
  protect,
  userLimiter,
  roleMiddleware("NGO"),
  markPickedUp,
);
router.get(
  "/ngo/history",
  protect,
  userLimiter,
  roleMiddleware("NGO"),
  ngoHistory,
);

router.get("/route", protect, roleMiddleware("NGO"), getRoute);

export default router;
