import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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
import type { UnpublishedNewsType } from "~/types/news";
import type { UserType } from "~/types/user";
import { fetchUserDetails, publishUnpublishedNews } from "~/hooks/useUserApi";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

interface Props {
    open: boolean;
    user: UserType | null;
    handleClose: () => void;
    onEditNews: (news: UnpublishedNewsType) => void;
}

export default function UserViewDialog({
    open,
    user,
    handleClose,
    onEditNews,
}: Props) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState<{
        user: UserType;
        unpublishedNews: UnpublishedNewsType[];
    } | null>(null);

    const loadDetails = async () => {
        if (!user) return;

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
        if (open) {
            loadDetails();
        } else {
            setDetails(null);
        }
    }, [open, user?._id]);

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
    const kyc = viewedUser?.kycDetails;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontWeight: 800 }}>
                Journalist Profile
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <Skeleton variant="rectangular" height={360} />
                ) : (
                    <Box sx={{ display: "grid", gap: 3 }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                            }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {viewedUser?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {viewedUser?.email}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={viewedUser?.role}
                                    size="small"
                                    color="primary"
                                />
                                <Chip
                                    label={
                                        viewedUser?.kycStatus
                                            ? "KYC complete"
                                            : "KYC pending"
                                    }
                                    size="small"
                                    color={
                                        viewedUser?.kycStatus
                                            ? "success"
                                            : "warning"
                                    }
                                />
                            </Stack>
                        </Stack>

                        <Divider />

                        <Box
                            sx={{
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
                                    <Typography
                                        variant="caption"
                                        color="text.secondary">
                                        {label}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                                Submitted News
                            </Typography>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            Headline
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            Status
                                        </TableCell>
                                        <TableCell align="right">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(details?.unpublishedNews || []).map(
                                        (news) => (
                                            <TableRow key={news._id} hover>
                                                <TableCell sx={{ fontWeight: 600 }}>
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
                                                                handlePublish(
                                                                    news,
                                                                )
                                                            }>
                                                            Post
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
                                    {details?.unpublishedNews.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        py: 3,
                                                        textAlign: "center",
                                                    }}>
                                                    No submitted news yet.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} color="inherit">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
