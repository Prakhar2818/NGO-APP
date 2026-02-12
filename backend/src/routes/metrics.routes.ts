import { Router } from "express";
import { Request, Response } from "express";

import { register } from "../utils/metrics.js";

const router = Router();

router.get("/metrics", async (_: Request, res: Response) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router