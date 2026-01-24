// App File

import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import profileRoutes from "./modules/auth/routes/profile.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

export default app;
