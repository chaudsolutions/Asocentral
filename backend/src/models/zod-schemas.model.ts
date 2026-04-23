import { z } from "zod";

// Signup schema
export const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
});

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Query params schema
export const userIdSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
});

// Generate TypeScript types from schemas
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
