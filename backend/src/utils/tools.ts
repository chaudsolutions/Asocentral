import jwt from "jsonwebtoken";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { JWT_SECRET } from "./constants";

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

// jwt token
export const generateToken = (_id: string): string => {
    return jwt.sign({ _id }, JWT_SECRET);
};

// hash password
export const hashPassword = (password: string): string => {
    const salt = genSaltSync(10);

    const hashedPassword = hashSync(password, salt);

    return hashedPassword;
};

// Utility function to validate password
export const validatePassword = (
    password: string,
    hashedPassword: string,
): boolean => {
    return compareSync(password, hashedPassword);
};
