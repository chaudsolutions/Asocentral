import { Document, model, Schema } from "mongoose";

export interface IAppSettings extends Document {
    key: string;
    general: {
        websiteName: string;
        logoUrl: string;
        websiteUrl: string;
        websiteDescription: string;
        adminEmail: string;
        marqueeText: string;
        address: string;
        socialLinks: {
            twitter: string;
            facebook: string;
            instagram: string;
            linkedin: string;
            youtube: string;
        };
    };
    security: {
        lockPassword: string;
        smtpHost: string;
        smtpPort: number;
        smtpUser: string;
        smtpPass: string;
    };
    aboutUs: {
        title: string;
        summary: string;
        sections: {
            title?: string;
            image?: string;
            description: string;
        }[];
    };
    contactUs: {
        title: string;
        description: string;
        email: string;
        phone: string;
        address: string;
    };
    faqs: {
        name: string;
        summary: string;
        questions: {
            question: string;
            answer: string;
        }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const appSettingsSchema = new Schema<IAppSettings>(
    {
        key: { type: String, default: "main", unique: true, required: true },
        general: {
            websiteName: { type: String, default: "Trojan News" },
            logoUrl: { type: String, default: "N/A" },
            websiteUrl: { type: String, default: "N/A" },
            websiteDescription: {
                type: String,
                default:
                    "Providing breaking news, deep investigations, and world-class journalism.",
            },
            adminEmail: { type: String, default: "" },
            marqueeText: { type: String, default: "" },
            address: { type: String, default: "" },
            socialLinks: {
                twitter: { type: String, default: "" },
                facebook: { type: String, default: "" },
                instagram: { type: String, default: "" },
                linkedin: { type: String, default: "" },
                youtube: { type: String, default: "" },
            },
        },
        aboutUs: {
            title: { type: String, default: "About Us" },
            summary: {
                type: String,
                default:
                    "Trojan News is a modern newsroom focused on timely reporting, verified facts, and meaningful stories.",
            },
            sections: {
                type: [
                    {
                        title: { type: String, default: "" },
                        image: { type: String, default: "" },
                        description: { type: String, default: "" },
                    },
                ],
                default: [],
            },
        },
        contactUs: {
            title: { type: String, default: "Contact Us" },
            description: {
                type: String,
                default:
                    "Reach our editorial desk for feedback, corrections, or partnership inquiries.",
            },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
            address: { type: String, default: "" },
        },
        faqs: {
            name: { type: String, default: "FAQs" },
            summary: {
                type: String,
                default:
                    "Find quick answers to common questions about accounts, publishing, and platform usage.",
            },
            questions: {
                type: [
                    {
                        question: { type: String, default: "" },
                        answer: { type: String, default: "" },
                    },
                ],
                default: [],
            },
        },
        security: {
            lockPassword: { type: String, default: "12345" },
            smtpHost: { type: String, default: "" },
            smtpPort: { type: Number, default: 587 },
            smtpUser: { type: String, default: "" },
            smtpPass: { type: String, default: "" },
        },
    },
    { timestamps: true },
);

const AppSettingsModel = model<IAppSettings>("AppSettings", appSettingsSchema);

export default AppSettingsModel;
