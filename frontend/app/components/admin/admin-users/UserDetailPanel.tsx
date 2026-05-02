import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { UnpublishedNewsType } from "~/types/news";
import type { UserType } from "~/types/user";
import { fetchUserDetails, publishUnpublishedNews } from "~/hooks/useUserApi";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

interface Props {
    user: UserType;
    onBack: () => void;
    onEditNews: (news: UnpublishedNewsType) => void;
}

export default function UserDetailPanel({ user, onBack, onEditNews }: Props) {
    const { showToast } = useToast();
    const [tab, setTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState<{
        user: UserType;
        unpublishedNews: UnpublishedNewsType[];
    } | null>(null);

    const loadDetails = async () => {
        setIsLoading(true);
        try {
            const res = await fetchUserDetails(user._id);
            setDetails(res);
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message || "Unable to load user",
                    "error",
                );
            } else {
                showToast("Unable to load user", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDetails();
    }, [user._id]);

    const handlePublish = async (news: UnpublishedNewsType) => {
        try {
            const res = await publishUnpublishedNews(news._id);
            showToast(res.message, "success");
            loadDetails();
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message || "Unable to post news",
                    "error",
                );
            } else {
                showToast("Unable to post news", "error");
            }
        }
    };

    const viewedUser = details?.user || user;
    const kyc = viewedUser.kycDetails;
    const submittedNews = details?.unpublishedNews || [];
    const pendingNews = submittedNews.filter((news) => !news.posted);

    if (isLoading) return <Skeleton variant="rectangular" height={500} />;

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        color="inherit">
                        Back
                    </Button>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                            {viewedUser.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {viewedUser.email}
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Chip label={viewedUser.role} color="primary" size="small" />
                    <Chip
                        label={
                            viewedUser.kycStatus ? "KYC complete" : "KYC pending"
                        }
                        color={viewedUser.kycStatus ? "success" : "warning"}
                        size="small"
                    />
                    <Chip
                        label={`${pendingNews.length} pending news`}
                        color={pendingNews.length ? "warning" : "default"}
                        size="small"
                    />
                </Stack>
            </Stack>

            <Paper elevation={0} sx={{ border: "1px solid #eee" }}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 2 }}>
                    <Tab label="Profile" />
                    <Tab label={`Unpublished News (${pendingNews.length})`} />
                    <Tab label="All Submitted News" />
                </Tabs>
                <Divider />

                {tab === 0 && (
                    <Box
                        sx={{
                            p: 3,
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}>
                        {[
                            ["Full name", `${kyc?.firstName || ""} ${kyc?.lastName || ""}`],
                            ["Occupation", kyc?.occupation || "-"],
                            ["Age", kyc?.age || "-"],
                            ["Address", kyc?.address || "-"],
                            ["State", kyc?.state || "-"],
                            ["Country", kyc?.country || "-"],
                        ].map(([label, value]) => (
                            <Box key={label}>
                                <Typography variant="caption" color="text.secondary">
                                    {label}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {(tab === 1 || tab === 2) && (
                    <Box sx={{ p: 3 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Headline
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(tab === 1 ? pendingNews : submittedNews).map(
                                    (news) => (
                                        <TableRow key={news._id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                {news.title}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        news.posted
                                                            ? "Posted"
                                                            : "Review"
                                                    }
                                                    color={
                                                        news.posted
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        onEditNews(news)
                                                    }>
                                                    Edit
                                                </Button>
                                                {!news.posted && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            handlePublish(news)
                                                        }>
                                                        Post
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
