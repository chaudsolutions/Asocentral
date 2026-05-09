import { Request, Response } from "express";
import { sendNotificationEmail } from "../utils/email";
import AppSettingsModel from "../models/app-settings.model";

export const staticController = {
    contactUs: async (req: Request, res: Response) => {
        try {
            const { name, email, subject, message } = req.body as {
                name?: string;
                email?: string;
                subject?: string;
                message?: string;
            };

            if (
                !name?.trim() ||
                !email?.trim() ||
                !subject?.trim() ||
                !message?.trim()
            ) {
                res.status(400).json({
                    success: false,
                    message: "Name, email, subject and message are required",
                });
                return;
            }

            const settings = await AppSettingsModel.findOne({ key: "main" });
            const recipient =
                settings?.general?.adminEmail ||
                settings?.contactUs?.email;
            if (!recipient) {
                res.status(500).json({
                    success: false,
                    message: "Admin contact email is not configured",
                });
                return;
            }

            await sendNotificationEmail({
                to: recipient,
                subject: `Contact Us: ${subject.trim()}`,
                heading: `New message from ${name.trim()}`,
                body: `Sender: ${email.trim()}<br/><br/>${message.trim()}`,
                ctaLabel: "Open Admin",
            });

            res.status(200).json({
                success: true,
                message: "Message sent successfully",
            });
        } catch (error) {
            console.error("Error sending contact email:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while sending message",
            });
        }
    },
};
