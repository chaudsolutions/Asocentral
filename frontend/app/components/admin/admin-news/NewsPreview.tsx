import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import type { NewsDataType } from "~/types/news";

export default function NewsPreview({ news }: { news: NewsDataType }) {
    return (
        <Box sx={{ maxWidth: "800px", mx: "auto", py: 4 }}>
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

            <Box
                component="img"
                src={news.image_url}
                sx={{
                    width: "100%",
                    borderRadius: 2,
                    mb: 4,
                    objectFit: "cover",
                    maxHeight: "450px",
                }}
            />

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

            <Divider sx={{ my: 4 }} />
            <Typography variant="caption" color="text.disabled">
                Source: {news.link} | Published: {news.pubDate}
            </Typography>
        </Box>
    );
}
