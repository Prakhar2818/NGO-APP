// App File

import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import profileRoutes from "./modules/auth/routes/profile.routes.js";
import donationRoutes from "./modules/donation/routes/donation.routes.js";
import adminRoutes from "./modules/admin/routes/admin.routes.js";
import { globalRateLimiter } from "./middleware/globalLimiter.middleware.js";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: ["https://ngo-app-theta.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());
app.set("trust proxy", 1);
app.use(globalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/admin", adminRoutes);

export default app;
