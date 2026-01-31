// App File

import express, {Application} from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import profileRoutes from "./modules/auth/routes/profile.routes.js";
import donationRoutes from "./modules/donation/routes/donation.routes.js"

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/donation", donationRoutes);

export default app;
