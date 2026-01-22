// App File

import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/auth.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;
