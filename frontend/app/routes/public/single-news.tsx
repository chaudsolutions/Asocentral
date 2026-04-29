import { useParams } from "react-router";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

import { useSingleNewsData } from "~/hooks/useCaching";
import { updateNewsMetrics } from "~/hooks/useNewsDataApi";
import { formatDate } from "~/hooks/useTools";

export default function SingleNews() {
    const { articleId } = useParams();
    const { singleNewsData } = useSingleNewsData(articleId || "");
    const articleRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleShare = async () => {
        if (!singleNewsData) return;
        try {
            await updateNewsMetrics(singleNewsData?._id, "shares");
            if (navigator.share) {
                await navigator.share({
                    title: singleNewsData?.title,
                    text: singleNewsData?.description,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    const handleDownloadPdf = async () => {
        if (!articleRef.current || !singleNewsData) return;
        setIsExporting(true);
        try {
            await updateNewsMetrics(singleNewsData?._id, "downloads");
            const canvas = await html2canvas(articleRef.current, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${singleNewsData?.title.substring(0, 20)}.pdf`);
        } catch (err) {
            console.error("PDF Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Grid container spacing={4}>
                {/* Main Content Column */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box ref={articleRef} sx={{ bgcolor: "white" }}>
                        {/* Header Section */}
                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Stack direction="row" spacing={1}>
                                {singleNewsData?.category.map((cat) => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        size="small"
                                        sx={{
                                            bgcolor: "#003366",
                                            color: "white",
                                            fontWeight: 700,
                                        }}
                                    />
                                ))}
                            </Stack>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    color: "#003366",
                                    fontSize: { xs: "2.2rem", md: "3.5rem" },
                                    lineHeight: 1.1,
                                }}>
                                {singleNewsData?.title}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 400,
                                    fontStyle: "italic",
                                }}>
                                {singleNewsData?.description}
                            </Typography>
                        </Stack>

                        {/* Main Image */}
                        <Box
                            component="img"
                            src={singleNewsData?.image_url}
                            sx={{
                                width: "100%",
                                borderRadius: 1,
                                mb: 4,
                                boxShadow: 3,
                            }}
                        />

                        {/* Article Content Loop */}
                        <Stack spacing={6}>
                            {singleNewsData?.content?.map((block, index) => (
                                <Box key={index}>
                                    {block.title && (
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 800,
                                                mb: 2,
                                                borderLeft: "5px solid #c00",
                                                pl: 2,
                                            }}>
                                            {block.title}
                                        </Typography>
                                    )}
                                    {block.image_url && (
                                        <Box
                                            component="img"
                                            src={block.image_url}
                                            sx={{
                                                width: "100%",
                                                borderRadius: 1,
                                                my: 3,
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: "1.15rem",
                                            lineHeight: 1.8,
                                            color: "#333",
                                        }}>
                                        {block.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Grid>

                {/* Sidebar Column */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ position: "sticky", top: 100 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                bgcolor: "#f8f9fa",
                                border: "1px solid #eee",
                            }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: "grey.600",
                                    textTransform: "uppercase",
                                    mb: 2,
                                }}>
                                Actions
                            </Typography>
                            <Stack spacing={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<ShareIcon />}
                                    onClick={handleShare}
                                    sx={{ bgcolor: "#003366" }}>
                                    Share Story
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={
                                        isExporting ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <PictureAsPdfIcon />
                                        )
                                    }
                                    onClick={handleDownloadPdf}
                                    disabled={isExporting}>
                                    Download as PDF
                                </Button>
                            </Stack>

                            <Divider sx={{ my: 3 }} />

                            <Stack spacing={2}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ alignItems: "center" }}>
                                    <CalendarMonthIcon color="action" />
                                    <Box>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary">
                                            Published On
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600 }}>
                                            {formatDate(
                                                singleNewsData?.pubDate ||
                                                    new Date().toISOString(),
                                            )}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary">
                                        Stats
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={3}
                                        sx={{ mt: 1 }}>
                                        <Typography variant="body2">
                                            <strong>
                                                {singleNewsData?.shares}
                                            </strong>{" "}
                                            Shares
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>
                                                {singleNewsData?.downloads}
                                            </strong>{" "}
                                            Downloads
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
