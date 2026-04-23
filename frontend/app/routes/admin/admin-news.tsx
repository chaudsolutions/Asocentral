import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        if (newValue === 0) {
            setSelectedNews(null);
            setIsEditMode(false);
        }
    };

    const handleEdit = (news: NewsDataType) => {
        setSelectedNews(news);
        setIsEditMode(true);
        setTabValue(1);
    };

    const handleView = (news: NewsDataType) => {
        setSelectedNews(news);
        setTabValue(2); // Switch to View Tab
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    News Management
                </Typography>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="All News" sx={{ fontWeight: 700 }} />
                    <Tab
                        label={isEditMode ? "Edit News" : "Create News"}
                        sx={{ fontWeight: 700 }}
                    />
                    <Tab
                        label="News Preview"
                        sx={{ fontWeight: 700 }}
                        disabled={!selectedNews}
                    />
                </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
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
                        setTabValue(0);
                    }}
                />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={2}>
                {selectedNews && <NewsPreview news={selectedNews} />}
            </CustomTabPanel>
        </Box>
    );
}
