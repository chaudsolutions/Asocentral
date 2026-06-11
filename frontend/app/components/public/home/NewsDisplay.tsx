import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import NewsList from "~/components/custom/news/NewsList";
import type { NewsDataType } from "~/types/news";

interface NewsDisplayProps {
    newsData: NewsDataType[];
    isNewsDataLoading: boolean;
}

const NewsDisplay = ({ newsData, isNewsDataLoading }: NewsDisplayProps) => {
    // 1. Manage visible count state
    const [visibleCount, setVisibleCount] = useState(10);

    // slice based on visibleCount
    const displayNews = newsData.slice(0, visibleCount) || [];
    const hasMore = newsData && visibleCount < newsData.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
        <Box sx={{ mt: 6 }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontFamily: "Arial Narrow, sans-serif",
                    borderBottom: "3px solid #222",
                    display: "inline-block",
                    mb: 3,
                    fontSize: { xs: "1rem", md: "1.5rem" },
                }}>
                Latest Updates
            </Typography>

            {isNewsDataLoading ? (
                [...Array(6)].map((_, i) => (
                    <Box key={i} sx={{ mb: 3 }}>
                        <Skeleton variant="rectangular" height={120} />
                    </Box>
                ))
            ) : (
                <Box>
                    {displayNews.map((news, index) => (
                        <Box key={index}>
                            <NewsList news={news} />
                            {index < displayNews.length - 1 && (
                                <Divider sx={{ my: 2, borderColor: "#eee" }} />
                            )}
                        </Box>
                    ))}

                    {/* 2. Fox News Style Load More Button */}
                    {hasMore && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4,
                            }}>
                            <Button
                                onClick={handleLoadMore}
                                variant="outlined"
                                sx={{
                                    color: "#222",
                                    borderColor: "#222",
                                    borderRadius: 0, // Sharp edges for news aesthetic
                                    fontWeight: 900,
                                    px: 4,
                                    py: 1,
                                    textTransform: "uppercase",
                                    fontFamily: "Arial Narrow, sans-serif",
                                    "&:hover": {
                                        borderColor: "#c00",
                                        color: "#c00",
                                        bgcolor: "transparent",
                                    },
                                }}>
                                Show More Stories
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default NewsDisplay;
