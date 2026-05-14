import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useFetchAllUsers } from "~/hooks/useCaching";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import { useToast } from "~/context/ToastContext";
import { deleteUser } from "~/hooks/useUserApi";
import { isAxiosError } from "axios";
import type { UserType } from "~/types/user";
import type { UnpublishedNewsType } from "~/types/news";
import UserTable from "~/components/admin/admin-users/UserTable";
import UserDialog from "~/components/admin/admin-users/UserDialog";
import UserDetailPanel from "~/components/admin/admin-users/UserDetailPanel";
import NewsEditorStepper from "~/components/admin/admin-news/NewsEditorStepper";
import { updateUnpublishedNews } from "~/hooks/useUserApi";
import type { Route } from "./+types/admin-users";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";

    return [
        { title: `Admin Users | ${appName}` },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
    ];
}

export default function AdminUsers() {
    const { confirm } = useConfirmDialog();
    const { showToast } = useToast();
    const {
        allUsers = [],
        isAllUsersLoading,
        refetchAllUsers,
    } = useFetchAllUsers();
    const nonAdminUsers = allUsers.filter((user) => user.role !== "admin");

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [selectedNews, setSelectedNews] =
        useState<UnpublishedNewsType | null>(null);

    const handleOpen = (user: UserType | null = null) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleView = (user: UserType) => {
        setSelectedUser(user);
    };

    const handleEditNews = (news: UnpublishedNewsType) => {
        setSelectedNews(news);
    };

    const handleDelete = async (user: UserType) => {
        await confirm({
            title: `Delete ${user.name}`,
            message: "Are you sure you want to delete this user?",
            confirmText: "Delete",
            confirmColor: "error",
            cancelText: "No",
            onConfirm: async () => {
                try {
                    const res = await deleteUser(user._id);

                    showToast(res.message, "success");
                    refetchAllUsers();
                } catch (error) {
                    if (isAxiosError(error)) {
                        showToast(
                            error.response?.data?.message ||
                                "Something went wrong",
                            "error",
                        );
                    } else {
                        showToast("Something went wrong", "error");
                    }
                }
            },
        });
    };

    if (selectedNews) {
        return (
            <NewsEditorStepper
                initialData={selectedNews}
                onSuccess={() => {
                    refetchAllUsers();
                }}
                onClose={() => setSelectedNews(null)}
                submitNews={async (payload, newsId) => {
                    await updateUnpublishedNews(newsId || "", payload);
                }}
                submitLabel="Save Submission"
                successMessage="Submitted news updated successfully"
            />
        );
    }

    if (selectedUser && !open) {
        return (
            <UserDetailPanel
                user={selectedUser}
                onBack={() => setSelectedUser(null)}
                onEditNews={handleEditNews}
            />
        );
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 4,
                    alignItems: "center",
                    gap: 2,
                }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => handleOpen()}
                    sx={{ bgcolor: "#003366" }}>
                    Add User
                </Button>
            </Box>

            <UserTable
                data={nonAdminUsers}
                isLoading={isAllUsersLoading}
                onEdit={handleOpen}
                onDelete={handleDelete}
                onView={handleView}
            />

            <UserDialog
                open={open}
                handleClose={handleClose}
                refetch={refetchAllUsers}
                initialData={selectedUser}
            />
        </>
    );
}
