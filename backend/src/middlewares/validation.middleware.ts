import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { loginSchema, signupSchema } from "../models/zod-schemas.model";

// Generic validation middleware
const validateRequest = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request body against schema
            const validatedData = schema.parse(req.body);

            // Replace body with validated data (optional but nice for type safety)
            req.body = validatedData;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: error.message || "Invalid request data",
                });
            } else {
                next(error);
            }
        }
    };
};

// Specific validation middlewares
export const validateSignup = validateRequest(signupSchema);
export const validateLogin = validateRequest(loginSchema);
