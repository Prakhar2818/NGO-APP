import pLimit from "p-limit";
import { NextFunction } from "express";

const limit = pLimit(5);

export const concurrencyUploadLimiter = async (next: NextFunction) => {
  await limit(() => Promise.resolve());
  next();
};
