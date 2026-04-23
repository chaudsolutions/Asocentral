import { Request, Response } from "express";
import { UnauthorizedError } from "../errors/httpError";
import { generateToken, validatePassword } from "../utils/tools";
import { UserModel } from "../models/user.model";

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export const authController = {
    /**
     * User Login
     */
    userLogin: async (req: LoginRequest, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await UserModel.findOne({
                email: email.toLowerCase(),
            });
            if (!user) {
                throw new UnauthorizedError("Invalid email or password");
            }

            // Validate password
            const isPasswordValid = await validatePassword(
                password,
                user.password || "",
            );
            if (!isPasswordValid) {
                throw new UnauthorizedError("Invalid email or password");
            }

            // Generate JWT token
            const token = generateToken(user.id);

            res.status(200).json({
                success: true,
                message: "Login successful",
                token,
            });
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
            } else {
                console.error("Login error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error during login",
                });
            }
        }
    },

    // admin login
    adminLogin: async (req: LoginRequest, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            console.log(req.body);

            // Find user by email
            const user = await UserModel.findOne({
                email: email.toLowerCase(),
            });
            if (!user || user.role !== "admin") {
                throw new UnauthorizedError("Invalid email or password");
            }

            // Validate password
            const isPasswordValid = await validatePassword(
                password,
                user.password || "",
            );
            if (!isPasswordValid) {
                throw new UnauthorizedError("Invalid email or password");
            }

            // Generate JWT token
            const token = generateToken(user.id);

            res.status(200).json({
                success: true,
                message: "Admin login successful",
                token,
            });
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
            } else {
                console.error("Admin login error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error during admin login",
                });
            }
        }
    },
};
