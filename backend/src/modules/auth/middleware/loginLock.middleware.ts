import { Request, Response, NextFunction } from "express";

type AttemptData = {
  count: number;
  lockUntil?: number;
};

const attempts = new Map<string, AttemptData>();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000;

// Check if locked
export const loginLockCheck = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.body.email;

  const data = attempts.get(key);

  if (data?.lockUntil && Date.now() < data.lockUntil) {
    const remaining = Math.ceil((data.lockUntil - Date.now()) / 1000);

    return res.status(429).json({
      success: false,
      message: `Account locked. Try again after ${remaining} seconds`,
    });
  }

  next();
};

// On failure
export const recordFailure = (key: string) => {
  const data = attempts.get(key) || { count: 0 };

  data.count++;

  if (data.count >= MAX_ATTEMPTS) {
    data.lockUntil = Date.now() + LOCK_TIME;
    data.count = 0;
  }

  attempts.set(key, data);
};

// On success
export const recordSuccess = (key: string) => {
  attempts.delete(key);
};
