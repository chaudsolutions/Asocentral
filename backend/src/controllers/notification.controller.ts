import { Request, Response } from "express";
import { NotificationModel } from "../models/notification.model";

export const notificationController = {
    getMyNotifications: async (req: Request, res: Response) => {
        try {
            const { category, isRead, limit = "25" } = req.query;
            const parsedLimit = Math.min(Number(limit) || 25, 100);

            const query: {
                recipient: string | undefined;
                category?: string;
                isRead?: boolean;
            } = {
                recipient: req.userId,
            };

            if (typeof category === "string" && category.trim()) {
                query.category = category.trim();
            }

            if (typeof isRead === "string") {
                query.isRead = isRead === "true";
            }

            const [notifications, unreadCount] = await Promise.all([
                NotificationModel.find(query)
                    .sort({ createdAt: -1 })
                    .limit(parsedLimit)
                    .lean(),
                NotificationModel.countDocuments({
                    recipient: req.userId,
                    isRead: false,
                }),
            ]);

            res.status(200).json({
                success: true,
                notifications,
                unreadCount,
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching notifications",
            });
        }
    },

    markNotificationRead: async (req: Request, res: Response) => {
        try {
            const { notificationId } = req.params;

            const notification = await NotificationModel.findOneAndUpdate(
                {
                    _id: notificationId,
                    recipient: req.userId,
                },
                { isRead: true },
                { new: true },
            );

            if (!notification) {
                res.status(404).json({
                    success: false,
                    message: "Notification not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Notification marked as read",
                notification,
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            res.status(500).json({
                success: false,
                message:
                    "Internal server error while updating notification status",
            });
        }
    },

    markAllNotificationsRead: async (req: Request, res: Response) => {
        try {
            await NotificationModel.updateMany(
                { recipient: req.userId, isRead: false },
                { isRead: true },
            );

            res.status(200).json({
                success: true,
                message: "All notifications marked as read",
            });
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            res.status(500).json({
                success: false,
                message:
                    "Internal server error while updating notification status",
            });
        }
    },
};
