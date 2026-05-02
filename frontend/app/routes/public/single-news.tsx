import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MessageIcon from "@mui/icons-material/Message";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

import { useSingleNewsData } from "~/hooks/useCaching";
import {
    addNewsComment,
    fetchSingleNewsData,
    updateNewsMetrics,
} from "~/hooks/useNewsDataApi";
import { formatDate } from "~/hooks/useTools";
import type { NewsCommentType, NewsDataType } from "~/types/news";
import { appName, websiteUrl } from "~/utils/constants";

export async function loader({ params }: { params: { articleId?: string } }) {
    if (!params.articleId) return { newsData: null };

    try {
        const newsData = await fetchSingleNewsData(params.articleId);
        return { newsData };
    } catch {
        return { newsData: null };
    }
}

export function meta({ data }: { data?: { newsData: NewsDataType | null } }) {
    const news = data?.newsData;
    const title = news ? `${news.title} | ${appName}` : `News | ${appName}`;
    const description =
        news?.description ||
        "Read the latest verified story from Trojan News Network.";
    const image = news?.image_url;
    const url = news ? `${websiteUrl}/news/${news.article_id}` : websiteUrl;

    return [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: news?.keywords?.join(", ") || appName },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: appName },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
        {
            type: "application/ld+json",
            content: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: news?.title,
                description,
                image,
                datePublished: news?.pubDate,
                author: {
                    "@type": "Organization",
                    name: appName,
                },
                publisher: {
                    "@type": "Organization",
                    name: appName,
                },
            }),
        },
    ];
}

const getBrowserSessionId = () => {
    const key = "trojan-news-browser-session";
    const existing = localStorage.getItem(key);
    if (existing) return existing;

    const sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
    return sessionId;
};

export default function SingleNews() {
    const { articleId } = useParams();
    const { singleNewsData } = useSingleNewsData(articleId || "");
    const articleRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [commentName, setCommentName] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState<NewsCommentType[]>([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        setComments(singleNewsData?.comments || []);
    }, [singleNewsData?.comments]);

    useEffect(() => {
        if (!singleNewsData?._id) return;

        const storageKey = `trojan-news-viewed-${singleNewsData._id}`;
        if (sessionStorage.getItem(storageKey)) return;

        sessionStorage.setItem(storageKey, "true");

        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(() => {
                updateNewsMetrics(singleNewsData._id, "views");
            });
        } else {
            globalThis.setTimeout(() => {
                updateNewsMetrics(singleNewsData._id, "views");
            }, 500);
        }

        // Check if article is bookmarked
        const bookmarks = JSON.parse(
            localStorage.getItem("bookmarked-news") || "[]",
        );
        setIsBookmarked(bookmarks.includes(singleNewsData._id));
    }, [singleNewsData?._id]);

    const handleShare = async (platform?: string) => {
        if (!singleNewsData) return;
        try {
            await updateNewsMetrics(singleNewsData._id, "shares");

            if (platform === "facebook") {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                );
            } else if (platform === "twitter") {
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(singleNewsData.title)}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                );
            } else if (platform === "linkedin") {
                window.open(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(singleNewsData.title)}`,
                    "_blank",
                );
            } else if (navigator.share) {
                await navigator.share({
                    title: singleNewsData.title,
                    text: singleNewsData.description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    const handleBookmark = () => {
        if (!singleNewsData?._id) return;

        const bookmarks = JSON.parse(
            localStorage.getItem("bookmarked-news") || "[]",
        );
        let newBookmarks;

        if (isBookmarked) {
            newBookmarks = bookmarks.filter(
                (id: string) => id !== singleNewsData._id,
            );
        } else {
            newBookmarks = [...bookmarks, singleNewsData._id];
        }

        localStorage.setItem("bookmarked-news", JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const handleDownloadPdf = async () => {
        if (!articleRef.current || !singleNewsData) return;
        setIsExporting(true);
        try {
            await updateNewsMetrics(singleNewsData._id, "downloads");
            const canvas = await html2canvas(articleRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${singleNewsData.title.substring(0, 50)}.pdf`);
        } catch (err) {
            console.error("PDF Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleComment = async () => {
        if (!singleNewsData?._id || !commentContent.trim()) return;

        setIsCommenting(true);
        try {
            const response = await addNewsComment(singleNewsData._id, {
                name: commentName.trim() || "Anonymous Reader",
                content: commentContent,
                sessionId: getBrowserSessionId(),
            });
            setComments(response.comments);
            setCommentContent("");
            if (!commentName.trim()) {
                setCommentName("");
            }
        } catch (err) {
            console.error("Comment failed", err);
        } finally {
            setIsCommenting(false);
        }
    };

    if (!singleNewsData) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Top Action Bar */}
            <Box
                sx={{
                    borderBottom: "1px solid #e0e0e0",
                    bgcolor: "white",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}>
                <Container maxWidth="lg">
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            py: 2,
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Share on Facebook">
                                <IconButton
                                    onClick={() => handleShare("facebook")}
                                    sx={{ color: "#1877f2" }}>
                                    <FacebookIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share on Twitter">
                                <IconButton
                                    onClick={() => handleShare("twitter")}
                                    sx={{ color: "#1da1f2" }}>
                                    <TwitterIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share on LinkedIn">
                                <IconButton
                                    onClick={() => handleShare("linkedin")}
                                    sx={{ color: "#0077b5" }}>
                                    <LinkedInIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="More Share Options">
                                <IconButton onClick={() => handleShare()}>
                                    <ShareIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={
                                    isExporting ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <PictureAsPdfIcon />
                                    )
                                }
                                onClick={handleDownloadPdf}
                                disabled={isExporting}
                                sx={{
                                    borderColor: "#003366",
                                    color: "#003366",
                                    "&:hover": {
                                        borderColor: "#002244",
                                        bgcolor: "rgba(0, 51, 102, 0.05)",
                                    },
                                }}>
                                Save as PDF
                            </Button>
                            <Tooltip
                                title={
                                    isBookmarked
                                        ? "Remove Bookmark"
                                        : "Bookmark Article"
                                }>
                                <IconButton
                                    onClick={handleBookmark}
                                    sx={{ color: "#003366" }}>
                                    {isBookmarked ? (
                                        <BookmarkIcon />
                                    ) : (
                                        <BookmarkBorderIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
                <Box ref={articleRef}>
                    {/* Article Header */}
                    <Stack spacing={3} sx={{ mb: 4 }}>
                        {/* Categories */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                flexWrap: "wrap",
                            }}>
                            {singleNewsData.category.map((cat) => (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    sx={{
                                        bgcolor: "#003366",
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                        "&:hover": { bgcolor: "#002244" },
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Title */}
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 800,
                                color: "#1a1a1a",
                                fontSize: {
                                    xs: "1.75rem",
                                    sm: "2.5rem",
                                    md: "3.5rem",
                                },
                                lineHeight: 1.2,
                                letterSpacing: "-0.01em",
                            }}>
                            {singleNewsData.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#4a4a4a",
                                fontWeight: 400,
                                fontSize: { xs: "1rem", sm: "1.25rem" },
                                lineHeight: 1.4,
                            }}>
                            {singleNewsData.description}
                        </Typography>

                        {/* Meta Info */}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{
                                alignItems: { sm: "center" },
                                justifyContent: "space-between",
                                pt: 2,
                                borderTop: "1px solid #e0e0e0",
                                borderBottom: "1px solid #e0e0e0",
                                py: 2,
                            }}>
                            <Stack direction="row" spacing={3}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems: "center",
                                    }}>
                                    <CalendarMonthIcon
                                        sx={{ color: "#666", fontSize: "1rem" }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {formatDate(
                                            singleNewsData.pubDate ||
                                                new Date().toISOString(),
                                        )}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems: "center",
                                    }}>
                                    <VisibilityIcon
                                        sx={{ color: "#666", fontSize: "1rem" }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {singleNewsData.views || 0} views
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    By
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}>
                                    {appName} Staff
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Featured Image */}
                    <Box
                        sx={{
                            position: "relative",
                            mb: 5,
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}>
                        <Box
                            component="img"
                            src={singleNewsData.image_url}
                            alt={singleNewsData.title}
                            sx={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </Box>

                    {/* Article Content */}
                    <Stack spacing={5}>
                        {singleNewsData.content?.map((block, index) => (
                            <Box key={index}>
                                {block.title && (
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: {
                                                xs: "1.5rem",
                                                md: "1.75rem",
                                            },
                                            mb: 2,
                                            color: "#003366",
                                            borderLeft: "4px solid #c00",
                                            pl: 2,
                                        }}>
                                        {block.title}
                                    </Typography>
                                )}
                                {block.image_url && (
                                    <Box
                                        component="img"
                                        src={block.image_url}
                                        alt={block.title || "Article image"}
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
                                        fontSize: {
                                            xs: "1rem",
                                            md: "1.125rem",
                                        },
                                        lineHeight: 1.8,
                                        color: "#2c2c2c",
                                        "& p": { mb: 2 },
                                    }}>
                                    {block.description}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* Stats Bar */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 5,
                        mb: 4,
                        p: 3,
                        bgcolor: "#f8f9fa",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                    }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textTransform: "uppercase" }}>
                                Shares
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700, color: "#003366" }}>
                                {singleNewsData.shares || 0}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textTransform: "uppercase" }}>
                                Downloads
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700, color: "#003366" }}>
                                {singleNewsData.downloads || 0}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textTransform: "uppercase" }}>
                                Views
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700, color: "#003366" }}>
                                {singleNewsData.views || 0}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textTransform: "uppercase" }}>
                                Comments
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700, color: "#003366" }}>
                                {comments.length}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Comments Section */}
                <Box>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mb: 3, alignItems: "center" }}>
                        <MessageIcon sx={{ color: "#003366" }} />
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                            Reader Comments
                        </Typography>
                        <Chip
                            label={`${comments.length} Comments`}
                            size="small"
                            sx={{ bgcolor: "#e0e0e0", fontWeight: 600 }}
                        />
                    </Stack>

                    {/* Comment Form */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            mb: 4,
                            bgcolor: "#fafafa",
                        }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mb: 2 }}>
                            Join the Discussion
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Name (optional)"
                                size="small"
                                value={commentName}
                                onChange={(event) =>
                                    setCommentName(event.target.value)
                                }
                                placeholder="Anonymous Reader"
                            />
                            <TextField
                                fullWidth
                                label="Your Comment"
                                multiline
                                minRows={4}
                                value={commentContent}
                                onChange={(event) =>
                                    setCommentContent(event.target.value)
                                }
                                placeholder="Share your thoughts on this article..."
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}>
                                <Button
                                    variant="contained"
                                    onClick={handleComment}
                                    disabled={
                                        isCommenting || !commentContent.trim()
                                    }
                                    sx={{
                                        bgcolor: "#003366",
                                        "&:hover": { bgcolor: "#002244" },
                                        px: 4,
                                    }}>
                                    {isCommenting ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Post Comment"
                                    )}
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Comments List */}
                    <Stack spacing={2}>
                        {comments.length === 0 ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    textAlign: "center",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                }}>
                                <MessageIcon
                                    sx={{ fontSize: 48, color: "#999", mb: 2 }}
                                />
                                <Typography
                                    variant="body1"
                                    color="text.secondary">
                                    Be the first to share your thoughts on this
                                    story.
                                </Typography>
                            </Paper>
                        ) : (
                            comments.map((comment, index) => (
                                <Paper
                                    key={`${comment.sessionId}-${index}`}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "#003366",
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.05)",
                                        },
                                    }}>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar sx={{ bgcolor: "#003366" }}>
                                            {(comment.name ||
                                                "A")[0].toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                spacing={1}
                                                sx={{
                                                    mb: 1,
                                                    alignItems: {
                                                        sm: "center",
                                                    },
                                                }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 700 }}>
                                                    {comment.name ||
                                                        "Anonymous Reader"}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary">
                                                    {formatDate(
                                                        comment.createdAt,
                                                    )}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1.6 }}>
                                                {comment.content}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            ))
                        )}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
