import { Document, model, Schema } from "mongoose";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

// interface for User document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    kycStatus: boolean;
    kycDetails: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        country: string;
        occupation: string;
        age: number;
        idCardImage?: string;
        idCardBackImage?: string;
        zip: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// user schema definition
const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        kycStatus: { type: Boolean, default: false },
        kycDetails: {
            firstName: { type: String },
            lastName: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            occupation: { type: String },
            age: { type: Number },
            idCardImage: { type: String },
            idCardBackImage: { type: String },
            zip: { type: String },
        },
    },
    { timestamps: true },
);

export const UserModel = model<IUser>("User", userSchema);
