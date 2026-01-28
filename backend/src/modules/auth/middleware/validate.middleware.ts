import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema | ((req: Request) => ZodSchema)) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validationSchema =
        typeof schema === "function" ? schema(req) : schema;

      validationSchema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: err.issues[0].message,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    } 
  };
