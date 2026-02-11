// App File

import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import profileRoutes from "./modules/auth/routes/profile.routes.js";
import donationRoutes from "./modules/donation/routes/donation.routes.js";
import adminRoutes from "./modules/admin/routes/admin.routes.js";
import { globalRateLimiter } from "./middleware/globalLimiter.middleware.js";

const app: Application = express();
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ngo-app-theta.vercel.app",
    process.env.CLIENT_URL,
  ].filter(Boolean) as string[],
);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      const isVercelDeployment = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(
        origin,
      );

      if (isVercelDeployment) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(globalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/admin", adminRoutes);

export default app;
