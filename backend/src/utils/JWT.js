// JWT Utilities

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Generate JWT Token
 * @param {Object} payload
 * @returns {String} token
 */

export const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

/**
 * Verify JWT Token
 * @param {String} token
 * @returns {Object} decoded payload
 */

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
