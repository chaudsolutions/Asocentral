import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNewsData } from "~/hooks/useCaching";
import type { NewsDataType } from "~/types/news";
import NewsEditorStepper from "~/components/admin/admin-news/NewsEditorStepper";
import NewsTable from "~/components/admin/admin-news/NewsTable";
import NewsPreview from "~/components/admin/admin-news/NewsPreview";
import { useToast } from "~/context/ToastContext";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import {
    deleteNewsData,
    fetchPublicSettings,
    updateNewsStatus,
} from "~/hooks/useNewsDataApi";
import { isAxiosError } from "axios";
import type { Route } from "./+types/admin-news";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";

    return [
        { title: `Admin News | ${appName}` },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
    ];
}

function CustomTabPanel({
    children,
    value,
    index,
}: {
    children?: React.ReactNode;
    index: number;
    value: number;
}) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: { xs: 1, md: 3 } }}>{children}</Box>
            )}
        </div>
    );
}

export default function AdminNews() {
    const [tabValue, setTabValue] = useState(0);
    const [selectedNews, setSelectedNews] = useState<NewsDataType | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const { showToast } = useToast();

    const { confirm } = useConfirmDialog();

    const { newsData = [], isNewsDataLoading, refetchNewsData } = useNewsData();

    const systemNewsData = useMemo(() => {
        return newsData.filter((news) => news.isSystem);
    }, [newsData]);

    const handleEdit = (news: NewsDataType) => {
        setSelectedNews(news);
        setIsEditMode(true);
        setTabValue(1);
    };

    const handleClose = () => {
        setSelectedNews(null);
        setIsEditMode(false);
        setTabValue(0);
    };

    const handleView = (news: NewsDataType) => {
        setSelectedNews(news);
        setTabValue(2); // Switch to View Tab
    };

    const handleToggleStatus = async (news: NewsDataType) => {
        const newStatus = !news.active;
        const actionText = newStatus ? "activate" : "deactivate";

        await confirm({
            title: `${newStatus ? "Activate" : "Deactivate"} News`,
            message: `Are you sure you want to ${actionText} "${news.title}"?`,
            confirmText: newStatus ? "Activate" : "Deactivate",
            confirmColor: newStatus ? "success" : "warning", // Success for live, Warning for offline
            onConfirm: async () => {
                try {
                    await updateNewsStatus(news._id, newStatus);
                    showToast(
                        `News ${newStatus ? "activated" : "deactivated"} successfully`,
                        "success",
                    );
                    refetchNewsData();
                } catch (error) {
                    const errorMessage = isAxiosError(error)
                        ? error.response?.data?.message
                        : null;

                    showToast(
                        errorMessage || `Failed to ${actionText} news`,
                        "error",
                    );
                }
            },
        });
    };

    const handleDelete = async (news: NewsDataType) => {
        await confirm({
            title: "Delete News",
            message: `Are you sure you want to delete "${news.title}"? This action cannot be undone.`,
            confirmText: "Delete",
            confirmColor: "error",
            onConfirm: async () => {
                try {
                    await deleteNewsData(news._id);
                    showToast("News deleted successfully", "success");
                    refetchNewsData();
                } catch (error) {
                    if (isAxiosError(error)) {
                        showToast(
                            error.response?.data?.message ||
                                "Failed to delete news",
                            "error",
                        );
                    } else {
                        showToast("Failed to delete news", "error");
                    }
                }
            },
        });
    };

    return (
        <>
            <CustomTabPanel value={tabValue} index={0}>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                    }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                        News Management
                    </Typography>
                    <Button
                        onClick={() => setTabValue(1)}
                        color="primary"
                        size="small"
                        variant="contained">
                        Create News
                    </Button>
                </Stack>
                <NewsTable
                    data={systemNewsData}
                    isLoading={isNewsDataLoading}
                    onEdit={handleEdit}
                    onView={handleView}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <NewsEditorStepper
                    initialData={isEditMode ? selectedNews : null}
                    onSuccess={() => {
                        refetchNewsData();
                    }}
                    onClose={handleClose}
                />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={2}>
                {selectedNews && (
                    <NewsPreview news={selectedNews} onClose={handleClose} />
                )}
            </CustomTabPanel>
        </>
    );
}
