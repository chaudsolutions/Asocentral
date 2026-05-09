import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MessageIcon from "@mui/icons-material/Message";
import type { NewsDataType } from "~/types/news";

export default function NewsPreview({
    news,
    onClose,
}: {
    news: NewsDataType;
    onClose: () => void;
}) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 280px" },
                gap: 3,
            }}>
            <Box>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    alignItems: "center",
                }}>
                <IconButton
                    onClick={onClose}
                    size="small"
                    color="error"
                    sx={{
                        bgcolor: "grey.200",
                    }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontSize: ".8rem",
                        fontWeight: 600,
                    }}>
                    Go Back
                </Typography>
            </Stack>
            {/* Header */}
            <Typography
                variant="h3"
                sx={{ fontWeight: 900, mb: 2, lineHeight: 1.2 }}>
                {news.title}
            </Typography>

            <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
                {news.category.map((cat) => (
                    <Chip
                        key={cat}
                        label={cat}
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Box>

            <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 4, fontStyle: "italic" }}>
                {news.description}
            </Typography>

                {news.image_url ? (
                    <Box
                        component="img"
                        src={news.image_url}
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            mb: 3,
                            objectFit: "cover",
                            maxHeight: "450px",
                        }}
                    />
                ) : null}

            {/* Content Blocks */}
            {news.content.map((block, index) => (
                <Box key={index} sx={{ mb: 6 }}>
                    {block.title && (
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 800, mb: 2 }}>
                            {block.title}
                        </Typography>
                    )}
                    {block.image_url && (
                        <Box
                            component="img"
                            src={block.image_url}
                            sx={{ width: "100%", borderRadius: 1, mb: 3 }}
                        />
                    )}
                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: "pre-line",
                            fontSize: "1.1rem",
                            lineHeight: 1.8,
                        }}>
                        {block.description}
                    </Typography>
                </Box>
            ))}

            {news.video_url && (
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                        Watch Related Video
                    </Typography>
                    <Box
                        component="video"
                        src={news.video_url}
                        controls
                        preload="metadata"
                        sx={{
                            width: "100%",
                            borderRadius: 2,
                            objectFit: "cover",
                            maxHeight: "450px",
                            bgcolor: "#111",
                        }}
                    />
                </Box>
            )}

            <Divider sx={{ my: 4 }} />
            <Typography variant="caption" color="text.disabled">
                Source: {news.link} | Published: {news.pubDate}
            </Typography>
            </Box>
            <Stack spacing={2}>
                <Paper elevation={0} sx={{ p: 2, border: "1px solid #e6e8ef" }}>
                    <Typography sx={{ fontWeight: 800, mb: 1 }}>Metrics</Typography>
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <CalendarMonthIcon fontSize="small" />
                            <Typography variant="body2">{news.pubDate}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <VisibilityIcon fontSize="small" />
                            <Typography variant="body2">{news.views || 0} Views</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <MessageIcon fontSize="small" />
                            <Typography variant="body2">
                                {news.comments?.length || 0} Comments
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}
