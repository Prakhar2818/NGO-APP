import pLimit from "p-limit";
import { Response, Request, NextFunction } from "express";

const limit = pLimit(5);

export const concurrencyUploadLimiter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  limit(() => Promise.resolve())
    .then(() => next())
    .catch(next);
};
