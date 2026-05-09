import { Types } from "mongoose";
import {
    INotification,
    NotificationCategory,
    NotificationModel,
} from "../models/notification.model";
import { UserModel } from "../models/user.model";
import { sendNotificationEmail } from "./email";

type NotifyArgs = {
    recipient: Types.ObjectId | string;
    category: NotificationCategory;
    title: string;
    message: string;
    entityType?: "news" | "user";
    entityId?: string;
    emailSubject?: string;
    emailHeading?: string;
    emailBody?: string;
    ctaLabel?: string;
    ctaLink?: string;
};

export const createNotification = async (
    args: NotifyArgs,
): Promise<INotification> => {
    return NotificationModel.create({
        recipient: args.recipient,
        category: args.category,
        title: args.title,
        message: args.message,
        entityType: args.entityType,
        entityId: args.entityId,
    });
};

export const createNotificationWithEmail = async (args: NotifyArgs) => {
    const notification = await createNotification(args);

    try {
        const recipient = await UserModel.findById(args.recipient).select(
            "email name",
        );
        if (!recipient?.email) return notification;

        await sendNotificationEmail({
            to: recipient.email,
            subject: args.emailSubject || args.title,
            heading: args.emailHeading || args.title,
            body: args.emailBody || args.message,
            ctaLabel: args.ctaLabel,
            ctaLink: args.ctaLink,
        });
    } catch (error) {
        console.error("Notification email error:", error);
    }

    return notification;
};
