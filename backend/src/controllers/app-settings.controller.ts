import { Request, Response } from "express";
import { BadRequestError } from "../errors/httpError";
import AppSettingsModel from "../models/app-settings.model";
import { UserModel } from "../models/user.model";

const getOrCreateSettings = async () => {
    let settings = await AppSettingsModel.findOne({ key: "main" });
    if (!settings) {
        settings = await AppSettingsModel.create({ key: "main" });
    }
    return settings;
};

export const appSettingsController = {
    getPublicSettings: async (req: Request, res: Response) => {
        try {
            const settings = await getOrCreateSettings();
            const plain = settings.toObject();
            // Never expose security credentials in public settings payload.
            const { security: _security, ...publicSettings } = plain;
            res.status(200).json({ success: true, settings: publicSettings });
        } catch (error) {
            console.error("Error fetching public settings:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching settings",
            });
        }
    },

    getAdminSettings: async (req: Request, res: Response) => {
        try {
            const admin = await UserModel.findById(req.userId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const settings = await getOrCreateSettings();
            res.status(200).json({ success: true, settings });
        } catch (error) {
            console.error("Error fetching admin settings:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching settings",
            });
        }
    },

    updateSettings: async (req: Request, res: Response) => {
        try {
            const admin = await UserModel.findById(req.userId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const existing = await getOrCreateSettings();
            const payload = req.body as Partial<{
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
                security: {
                    lockPassword: string;
                    smtpHost: string;
                    smtpPort: number;
                    smtpUser: string;
                    smtpPass: string;
                };
            }>;

            const settings = await AppSettingsModel.findByIdAndUpdate(
                existing._id,
                {
                    general: { ...existing.general, ...(payload.general || {}) },
                    aboutUs: { ...existing.aboutUs, ...(payload.aboutUs || {}) },
                    contactUs: {
                        ...existing.contactUs,
                        ...(payload.contactUs || {}),
                    },
                    faqs: {
                        ...existing.faqs,
                        ...(payload.faqs || {}),
                    },
                    security: {
                        ...existing.security,
                        ...(payload.security || {}),
                    },
                },
                { new: true },
            );

            res.status(200).json({
                success: true,
                message: "Settings updated successfully",
                settings,
            });
        } catch (error) {
            console.error("Error updating settings:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while updating settings",
            });
        }
    },
};
