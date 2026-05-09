export interface ToastState {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
}

export type NotificationCategory =
    | "news_submitted"
    | "news_posted"
    | "news_created"
    | "kyc_completed"
    | "user_created"
    | "news_commented";

export interface NotificationType {
    _id: string;
    recipient: string;
    category: NotificationCategory;
    title: string;
    message: string;
    entityType?: "news" | "user";
    entityId?: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}
