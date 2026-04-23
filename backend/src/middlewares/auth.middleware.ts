import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";

// Extend Request type to include user using module augmentation
declare module "express" {
    interface Request {
        userId?: string;
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // 1. Get token from headers
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided",
            });
            return; // Important: return after sending response
        }

        const token = authHeader.split(" ")[1];

        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };

        // 3. Attach user ID to request
        req.userId = decoded._id;

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        // Handle different JWT errors specifically
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Session expired, please login again",
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }

        // Handle any other errors
        res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
};
