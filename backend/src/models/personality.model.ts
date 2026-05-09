import { Document, model, Schema } from "mongoose";

export interface IPersonality extends Document {
    title: string;
    description: string;
    image: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const personalitySchema = new Schema<IPersonality>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        website: { type: String, trim: true, default: "" },
        socialLinks: {
            twitter: { type: String, trim: true, default: "" },
            facebook: { type: String, trim: true, default: "" },
            instagram: { type: String, trim: true, default: "" },
            linkedin: { type: String, trim: true, default: "" },
            youtube: { type: String, trim: true, default: "" },
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

const PersonalityModel =
    model<IPersonality>("Personality", personalitySchema);

export default PersonalityModel;
