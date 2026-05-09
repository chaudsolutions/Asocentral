import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MessageIcon from "@mui/icons-material/Message";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

import { useAdminData, useSingleNewsData, useUserData } from "~/hooks/useCaching";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormTextField from "~/components/form-fields/FormTextField";
import {
    addNewsComment,
    deleteNewsComment,
    fetchSingleNewsData,
    updateNewsMetrics,
} from "~/hooks/useNewsDataApi";
import { formatDate } from "~/hooks/useTools";
import type { NewsCommentType, NewsDataType } from "~/types/news";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { AppSettingsType } from "~/types/settings";
import { useAuthContext } from "~/context/AuthContext";

export async function loader({ params }: { params: { articleId?: string } }) {
    if (!params.articleId) return { newsData: null };

    try {
        const [newsData, settings] = await Promise.all([
            fetchSingleNewsData(params.articleId),
            fetchPublicSettings(),
        ]);
        return { newsData, settings };
    } catch {
        return { newsData: null, settings: null };
    }
}

export function meta({
    data,
}: {
    data?: { newsData: NewsDataType | null; settings?: AppSettingsType | null };
}) {
    const news = data?.newsData;
    const appName = data?.settings?.general?.websiteName || "N/A";
    const websiteUrl = data?.settings?.general?.websiteUrl || "N/A";
    const title = news ? `${news.title} | ${appName}` : `News | ${appName}`;
    const description =
        news?.description ||
        "Read the latest verified story from Trojan News Network.";
    const image = news?.image_url;
    const url = news ? `${websiteUrl}/news/${news.article_id}` : websiteUrl;

    return [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: news?.keywords?.join(", ") || "N/A" },
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
    const { adminToken, userToken } = useAuthContext();
    const { adminData } = useAdminData();
    const { userData } = useUserData();
    const { singleNewsData, isSingleNewsDataLoading } = useSingleNewsData(
        articleId || "",
    );
    const articleRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [comments, setComments] = useState<NewsCommentType[]>([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [visibleComments, setVisibleComments] = useState(5);
    const { control, handleSubmit, watch, reset } = useForm<{
        commentName: string;
        commentContent: string;
    }>({
        defaultValues: {
            commentName: "",
            commentContent: "",
        },
    });
    const commentContent = watch("commentContent");

    const handleLoadMore = () => {
        setVisibleComments((prev) => prev + 5);
    };

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

    const handleComment = async (formData: {
        commentName: string;
        commentContent: string;
    }) => {
        if (!singleNewsData?._id || !commentContent.trim()) return;

        setIsCommenting(true);
        try {
            const response = await addNewsComment(singleNewsData._id, {
                name: formData.commentName.trim() || "Anonymous Reader",
                content: formData.commentContent,
                sessionId: getBrowserSessionId(),
            });
            setComments(response.comments);
            reset({ commentName: "", commentContent: "" });
        } catch (err) {
            console.error("Comment failed", err);
        } finally {
            setIsCommenting(false);
        }
    };

    const canManageComments = Boolean(adminToken && adminData?._id)
        || Boolean(
            userToken &&
                userData?._id &&
                singleNewsData?.creator?.includes(userData._id),
        );

    const handleDeleteComment = async (commentId?: string) => {
        if (!singleNewsData?._id || !commentId || !canManageComments) return;
        if (!window.confirm("Delete this comment?")) return;

        try {
            const response = await deleteNewsComment(singleNewsData._id, commentId);
            setComments(response.comments || []);
        } catch (err) {
            console.error("Delete comment failed", err);
        }
    };

    if (isSingleNewsDataLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

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
                                    xs: "1.3rem",
                                    md: "2rem",
                                },
                            }}>
                            {singleNewsData.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#4a4a4a",
                                fontWeight: 400,
                                fontSize: "1rem",
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
                                        ,{" "}
                                        {new Date(
                                            singleNewsData.pubDate || "",
                                        ).toLocaleTimeString()}
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
                        </Stack>
                    </Stack>

                    {/* Featured Image */}
                    {singleNewsData.image_url && (
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
                                    objectFit: "cover",
                                    maxHeight: 500,
                                    display: "block",
                                }}
                            />
                        </Box>
                    )}

                    {/* Article Content */}
                    <Stack spacing={5}>
                        {singleNewsData.content?.map((block, index) => (
                            <Box key={index}>
                                {block.title && (
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1.4rem",
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
                                            objectFit: "cover",
                                            maxHeight: 500,
                                        }}
                                    />
                                )}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: "pre-line",
                                        fontSize: ".9rem",
                                        lineHeight: 1.8,
                                        color: "#2c2c2c",
                                        "& p": { mb: 2 },
                                    }}>
                                    {block.description}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    {/* End of article video */}
                    {singleNewsData.video_url && (
                        <Box sx={{ mt: 5 }}>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, mb: 2, color: "#003366" }}>
                                Watch Related Video
                            </Typography>
                            <Box
                                component="video"
                                src={singleNewsData.video_url}
                                controls
                                preload="metadata"
                                sx={{
                                    width: "100%",
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    maxHeight: 500,
                                    bgcolor: "#111",
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Comments Section */}
                <Box>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mt: 10, alignItems: "center" }}>
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
                        <Stack
                            spacing={2}
                            component="form"
                            onSubmit={handleSubmit(handleComment)}>
                            <FormTextField
                                name="commentName"
                                label="Name (optional)"
                                control={control}
                                placeholder="Anonymous Reader"
                            />
                            <FormTextArea
                                name="commentContent"
                                label="Your Comment"
                                control={control}
                                rows={4}
                                placeholder="Share your thoughts on this article..."
                                rules={{
                                    required:
                                        "Comment content cannot be empty",
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}>
                                <Button
                                    type="submit"
                                    variant="contained"
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
                    <Stack spacing={1.5}>
                        {comments.length === 0 && (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 6,
                                    color: "#777",
                                }}>
                                <MessageIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="body2">
                                    No comments yet. Be the first to share your
                                    thoughts.
                                </Typography>
                            </Box>
                        )}
                        {comments
                            .slice(0, visibleComments)
                            .map((comment, index) => (
                                <Box
                                    key={`${comment.sessionId}-${index}`}
                                    sx={{
                                        display: "flex",
                                        gap: 1.5,
                                        py: 1.5,
                                        borderBottom: "1px solid #eee",
                                    }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "#003366",
                                            width: 32,
                                            height: 32,
                                            fontSize: "0.8rem",
                                        }}>
                                        {(comment.name || "A")[0].toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ alignItems: "center" }}>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 600 }}>
                                                {comment.name || "Anonymous"}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary">
                                                {formatDate(comment.createdAt)}
                                            </Typography>
                                        </Stack>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5,
                                                lineHeight: 1.6,
                                                color: "#333",
                                            }}>
                                            {comment.content}
                                        </Typography>
                                    </Box>
                                    {canManageComments && comment.commentId && (
                                        <Tooltip title="Delete comment">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment.commentId,
                                                    )
                                                }>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            ))}
                        {visibleComments < comments.length && (
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <Button
                                    onClick={handleLoadMore}
                                    variant="text"
                                    sx={{
                                        color: "#003366",
                                        fontWeight: 600,
                                        textTransform: "none",
                                    }}>
                                    Load more comments
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Stats Bar */}
                <Box
                    sx={{
                        mt: 4,
                        py: 2,
                        px: 2,
                        borderTop: "1px solid #e0e0e0",
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}>
                    {[
                        { label: "Views", value: singleNewsData.views || 0 },
                        { label: "Shares", value: singleNewsData.shares || 0 },
                        {
                            label: "Downloads",
                            value: singleNewsData.downloads || 0,
                        },
                        { label: "Comments", value: comments.length },
                    ].map((stat) => (
                        <Box key={stat.label}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#777",
                                    textTransform: "uppercase",
                                    fontSize: "0.65rem",
                                }}>
                                {stat.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#003366",
                                    fontSize: "1rem",
                                }}>
                                {stat.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
