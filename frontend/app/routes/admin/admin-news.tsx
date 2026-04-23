import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNewsData } from "~/hooks/useCaching";
import { appName } from "~/utils/constants";
import type { NewsDataType } from "~/types/news";
import NewsEditorStepper from "~/components/admin/admin-news/NewsEditorStepper";
import NewsTable from "~/components/admin/admin-news/NewsTable";
import NewsPreview from "~/components/admin/admin-news/NewsPreview";

export function meta() {
    return [{ title: `Admin News | ${appName}` }];
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

    return (
        <>
            <CustomTabPanel value={tabValue} index={0}>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
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
                {selectedNews && <NewsPreview news={selectedNews} />}
            </CustomTabPanel>
        </>
    );
}
