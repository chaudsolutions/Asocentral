import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import LinearProgress from "@mui/material/LinearProgress";
import { useMyUnpublishedNews, useUserData } from "~/hooks/useCaching";
import NewsEditorStepper from "~/components/admin/admin-news/NewsEditorStepper";
import { createUnpublishedNews } from "~/hooks/useUserApi";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

export function meta() {
    return [{ title: "Journalist News | N/A" }];
}

export default function UserNews() {
    const [isCreating, setIsCreating] = useState(false);
    const { showToast } = useToast();
    const { userData, isUserDataLoading } = useUserData();
    const {
        myUnpublishedNews = [],
        isMyUnpublishedNewsLoading,
        refetchMyUnpublishedNews,
    } = useMyUnpublishedNews();

    if (isUserDataLoading) {
        return <LinearProgress />;
    }

    if (isCreating) {
        return (
            <NewsEditorStepper
                initialData={null}
                onSuccess={refetchMyUnpublishedNews}
                onClose={() => setIsCreating(false)}
                submitNews={async (payload) => {
                    try {
                        await createUnpublishedNews(payload);
                    } catch (error) {
                        if (isAxiosError(error)) {
                            showToast(
                                error.response?.data?.message ||
                                    "Unable to submit news",
                                "error",
                            );
                        }
                        throw error;
                    }
                }}
                submitLabel="Submit for Review"
                successMessage="News submitted for admin review"
                showCreators={false}
            />
        );
    }

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        My News
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Draft and submit stories for editorial review.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreating(true)}
                    disabled={!userData?.kycStatus}
                    sx={{ bgcolor: "#003366" }}>
                    Create News
                </Button>
            </Box>

            {!userData?.kycStatus && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "warning.light",
                        bgcolor: "warning.50",
                    }}>
                    <Typography variant="body2">
                        Complete KYC in settings before submitting news.
                    </Typography>
                </Paper>
            )}

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid #eee" }}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Headline
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Category
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Submitted
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myUnpublishedNews.map((news) => (
                            <TableRow key={news._id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    {news.title}
                                </TableCell>
                                <TableCell>
                                    {news.category.map((cat) => (
                                        <Chip
                                            key={cat}
                                            label={cat}
                                            size="small"
                                            sx={{ mr: 0.5 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            news.posted
                                                ? "Posted"
                                                : "In review"
                                        }
                                        color={
                                            news.posted
                                                ? "success"
                                                : "warning"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {news.createdAt
                                        ? new Date(
                                              news.createdAt,
                                          ).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isMyUnpublishedNewsLoading &&
                            myUnpublishedNews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                py: 4,
                                                textAlign: "center",
                                            }}>
                                            No submissions yet.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
