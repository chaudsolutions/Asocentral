import { rateLimit } from "express-rate-limit";
import { RequestHandler } from "express";

// Basic rate limiter
export const apiRateLimiter: RequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 100 requests per window
    standardHeaders: "draft-7", // Use draft-7 standard headers
    legacyHeaders: false, // Disable legacy headers
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
});

// Strict rate limiter for auth routes
export const authRateLimiter: RequestHandler = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    limit: 5, // Limit each IP to 5 requests per window
    message: {
        success: false,
        message: "Too many login attempts, please try again later",
    },
});
