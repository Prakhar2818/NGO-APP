// JWT Utilities

import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload: string | object | Buffer): string => {
  return jwt.sign(payload, env.jwtSecret as string, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, env.jwtSecret as string);
};
