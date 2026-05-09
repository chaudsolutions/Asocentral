import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { notificationController } from "../../controllers/notification.controller";

const notificationRoute = Router();

notificationRoute.use(authenticate);

notificationRoute.get("/", notificationController.getMyNotifications);
notificationRoute.patch(
    "/read-all",
    notificationController.markAllNotificationsRead,
);
notificationRoute.patch(
    "/:notificationId/read",
    notificationController.markNotificationRead,
);

export default notificationRoute;
