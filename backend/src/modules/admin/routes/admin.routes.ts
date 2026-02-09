import Router from "express";
import { protect } from "../../auth/middleware/auth.middleware.js";
import { roleMiddleware } from "../../donation/middleware/role.middleware.js";
import {
  getAllUsers,
  createUser,
  updateUser,
  toggleBlockUser,
  getAllDonations,
  donationSummary,
  donationTrends,
} from "../controllers/admin.controller.js";

import { userLimiter } from "../../../middleware/userLimiter.middleware.js";

const router = Router();

// Get All users
router.get(
  "/users",
  protect,
  userLimiter,
  roleMiddleware("ADMIN"),
  getAllUsers,
);

// Create NGO / Restaurant
router.post(
  "/users",
  protect,
  userLimiter,
  roleMiddleware("ADMIN"),
  createUser,
);

// Update user (name / org / restaurant)
router.patch(
  "/users/:id",
  protect,
  userLimiter,
  roleMiddleware("ADMIN"),
  updateUser,
);

// Block / Unblock user
router.patch(
  "/users/:id/block",
  protect,
  userLimiter,
  roleMiddleware("ADMIN"),
  toggleBlockUser,
);

// View all donations with filters
router.get("/donations", protect, roleMiddleware("ADMIN"), getAllDonations);

// Donation summary (total + status wise)
router.get(
  "/analytics/summary",
  protect,
  userLimiter,
  roleMiddleware("ADMIN"),
  donationSummary,
);

// Daily / Weekly / Monthly trends
router.get(
  "/analytics/trends",
  protect,
  roleMiddleware("ADMIN"),
  donationTrends,
);

export default router;
