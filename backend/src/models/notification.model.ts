import { Document, model, Schema, Types } from "mongoose";

export enum NotificationCategory {
    NEWS_SUBMITTED = "news_submitted",
    NEWS_POSTED = "news_posted",
    NEWS_CREATED = "news_created",
    KYC_COMPLETED = "kyc_completed",
    USER_CREATED = "user_created",
    NEWS_COMMENTED = "news_commented",
}

export interface INotification extends Document {
    recipient: Types.ObjectId;
    category: NotificationCategory;
    title: string;
    message: string;
    entityType?: "news" | "user";
    entityId?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        category: {
            type: String,
            enum: Object.values(NotificationCategory),
            required: true,
            index: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        entityType: {
            type: String,
            enum: ["news", "user"],
        },
        entityId: { type: String },
        isRead: { type: Boolean, default: false, index: true },
    },
    { timestamps: true },
);

export const NotificationModel =
    model<INotification>("Notification", notificationSchema);
