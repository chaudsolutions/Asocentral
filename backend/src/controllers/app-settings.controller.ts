import { Request, Response } from "express";
import { BadRequestError } from "../errors/httpError";
import AppSettingsModel from "../models/app-settings.model";
import { UserModel } from "../models/user.model";
import { sendNotificationEmail } from "../utils/email";

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
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching settings",
            });
        }
    },

    sendTestEmail: async (req: Request, res: Response) => {
        try {
            const admin = await UserModel.findById(req.userId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const { testEmail } = req.body as { testEmail?: string };
            if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
                throw new BadRequestError("A valid recipient email address is required");
            }

            const settings = await AppSettingsModel.findOne({ key: "main" }).lean();
            const smtpHost = settings?.security?.smtpHost || "";
            const smtpUser = settings?.security?.smtpUser || "";
            const smtpPass = settings?.security?.smtpPass || "";

            if (!smtpHost || !smtpUser || !smtpPass) {
                throw new BadRequestError(
                    "SMTP credentials are not configured. Please fill in the SMTP Host, User, and Password fields before testing."
                );
            }

            await sendNotificationEmail({
                to: testEmail,
                subject: "✅ SMTP Test — Your mail settings are working!",
                heading: "Test Email Successful",
                body: "This is a test email sent from your admin settings panel. If you received this, your SMTP credentials are configured correctly and emails will be delivered successfully.",
                ctaLabel: "Go to Dashboard",
            });

            res.status(200).json({
                success: true,
                message: `Test email sent successfully to ${testEmail}`,
            });
        } catch (error) {
            console.error("Error sending test email:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }

            // Detect SMTP connection/timeout failures (common on Render free tier
            // which blocks outbound SMTP on ports 25, 465, and 587).
            const err = error as NodeJS.ErrnoException & { command?: string };
            const isNetworkError =
                err.code === "ETIMEDOUT" ||
                err.code === "ECONNREFUSED" ||
                err.code === "ECONNRESET" ||
                err.code === "ENOTFOUND";

            if (isNetworkError) {
                const smtpPort = (await AppSettingsModel.findOne({ key: "main" }).lean())
                    ?.security?.smtpPort ?? 587;
                res.status(502).json({
                    success: false,
                    message:
                        `Cannot reach your SMTP server (${err.code} on port ${smtpPort}). ` +
                        `If you are hosted on Render's free plan, outbound SMTP on ports 25, 465, and 587 is blocked. ` +
                        `Try switching to port 2525 (supported by SendGrid, Mailgun, Mailtrap) or upgrade your Render plan.`,
                });
                return;
            }

            // Authentication or credential errors
            if (err.message?.toLowerCase().includes("auth") || err.message?.toLowerCase().includes("535")) {
                res.status(502).json({
                    success: false,
                    message: "SMTP authentication failed. Please double-check your SMTP username and password.",
                });
                return;
            }

            const message = err.message || "Failed to send test email";
            res.status(500).json({ success: false, message });
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
                personalityOfTheWeek: {
                    title: string;
                    summary: string;
                };
            }>;

            const settings = await AppSettingsModel.findByIdAndUpdate(
                existing._id,
                {
                    general: {
                        ...existing.general,
                        ...(payload.general || {}),
                    },
                    aboutUs: {
                        ...existing.aboutUs,
                        ...(payload.aboutUs || {}),
                    },
                    contactUs: {
                        ...existing.contactUs,
                        ...(payload.contactUs || {}),
                    },
                    faqs: {
                        ...existing.faqs,
                        ...(payload.faqs || {}),
                    },
                    personalityOfTheWeek: {
                        ...existing.personalityOfTheWeek,
                        ...(payload.personalityOfTheWeek || {}),
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
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while updating settings",
            });
        }
    },
};
