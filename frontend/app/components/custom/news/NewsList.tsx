import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import type { NewsDataType } from "~/types/news";

const NewsList = ({ news }: { news: NewsDataType }) => {
    const isLocalNews = !!news._id;

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.8 },
            }}>
            {/* Thumbnail Image */}
            <Box
                component="img"
                src={
                    news.image_url ||
                    "https://via.placeholder.com/150x100?text=Trojan+News"
                }
                alt={news.title}
                sx={{
                    width: { xs: 100, sm: 180 },
                    height: { xs: 80, sm: 120 },
                    objectFit: "cover",
                    flexShrink: 0,
                    bgcolor: "#f0f0f0",
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                {/* Category Tag */}
                {news.category && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#c00",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            mb: 0.5,
                        }}>
                        {news.category[0]}
                    </Typography>
                )}

                <Link
                    to={isLocalNews ? `/news/${news.article_id}` : news.link}
                    target={isLocalNews ? "_self" : "_blank"}
                    style={{ textDecoration: "none" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#222",
                            fontWeight: 800,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            lineHeight: 1.2,
                            fontFamily: "Arial Narrow, sans-serif",
                            mb: 1,
                            // Limit title to 2 lines
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}>
                        {news.title}
                    </Typography>
                </Link>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#666",
                        display: { xs: "none", sm: "-webkit-box" },
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4,
                    }}>
                    {news.description}
                </Typography>
            </Box>
        </Box>
    );
};

export default NewsList;
