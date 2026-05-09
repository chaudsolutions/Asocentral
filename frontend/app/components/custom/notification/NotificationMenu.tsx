import { useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useQueryClient } from "@tanstack/react-query";
import {
    markAllNotificationsRead,
    markNotificationRead,
} from "~/hooks/useUserApi";
import { useMyNotifications } from "~/hooks/useCaching";

const categoryLabel: Record<string, string> = {
    news_submitted: "Submitted",
    news_posted: "Posted",
    news_created: "Created",
    kyc_completed: "KYC",
    user_created: "User",
    news_commented: "Comment",
};

const NotificationMenu = () => {
    const queryClient = useQueryClient();
    const { notificationsData, isNotificationsLoading } = useMyNotifications();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const notifications = notificationsData?.notifications || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    const hasUnread = useMemo(
        () => notifications.some((notification) => !notification.isRead),
        [notifications],
    );

    const handleMarkRead = async (notificationId: string) => {
        await markNotificationRead(notificationId);
        queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    };

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsOutlinedIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                slotProps={{ paper: { sx: { width: 360, maxWidth: "96vw" } } }}>
                <Stack
                    direction="row"
                    sx={{ alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
                    <Button size="small" onClick={handleMarkAllRead} disabled={!hasUnread}>
                        Mark all read
                    </Button>
                </Stack>
                <Divider />
                {isNotificationsLoading ? (
                    <Box sx={{ py: 3, textAlign: "center" }}>
                        <CircularProgress size={22} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Typography sx={{ px: 2, py: 3, color: "text.secondary" }}>
                        No notifications yet.
                    </Typography>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification._id}
                            onClick={() => handleMarkRead(notification._id)}
                            sx={{
                                alignItems: "flex-start",
                                whiteSpace: "normal",
                                py: 1.3,
                                bgcolor: notification.isRead ? "transparent" : "rgba(0, 51, 102, 0.06)",
                            }}>
                            <Box>
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {notification.title}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            bgcolor: "#eef2ff",
                                            px: 0.8,
                                            borderRadius: 1,
                                            color: "#3730a3",
                                        }}>
                                        {categoryLabel[notification.category] || "General"}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {notification.message}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationMenu;
