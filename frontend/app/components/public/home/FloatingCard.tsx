import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import { useNewsData } from "~/hooks/useCaching";

const FloatingCard = () => {
    const { newsData = [], isNewsDataLoading } = useNewsData();
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);

    // Filter news that has titles to avoid empty fades
    const filteredNews = newsData?.filter((n) => n.title).slice(5, 15) || [];

    useEffect(() => {
        if (filteredNews.length === 0) return;

        const interval = setInterval(() => {
            setShow(false); // Trigger fade out
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % filteredNews.length);
                setShow(true); // Trigger fade in
            }, 500); // Wait for fade out to finish
        }, 5000); // Show each news for 5 seconds

        return () => clearInterval(interval);
    }, [filteredNews.length]);

    if (isNewsDataLoading) {
        return (
            <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 0 }}
            />
        );
    }

    const currentNews = filteredNews[index];

    return (
        <Box
            sx={{
                bgcolor: "#f6f6f6",
                borderTop: "4px solid #c00", // The signature red top border
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",

                position: "sticky",
                top: 20, // Distance from the top of the screen when scrolling
                height: "fit-content", // Shrink to fit content
                maxHeight: "70vh", // Ensure it doesn't overflow the screen
                zIndex: 10,
            }}>
            {/* Logo/Header Section */}
            <Box sx={{ bgcolor: "#003366", p: 1, textAlign: "center" }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: "white",
                        display: "block",
                        fontWeight: 700,
                    }}>
                    LIVE & ON DEMAND
                </Typography>
            </Box>

            {/* Availability Section */}
            <Box sx={{ p: 3 }}>
                <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 900, color: "#222", mb: 1 }}>
                    AVAILABLE IN:
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "#555", mb: 2, fontWeight: 600 }}>
                    Nigeria | UK | USA
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 900, color: "#222", mb: 1 }}>
                    CHANNEL:
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "#c00", fontWeight: 800 }}>
                    DSTV CH. 412 | GOTV CH. 94
                </Typography>
            </Box>

            {/* Fading News Ticker Section */}
            <Box
                sx={{
                    mt: "auto",
                    bgcolor: "white",
                    borderTop: "1px solid #ddd",
                    flexGrow: 1,
                }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: "#c00",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        display: "block",
                        mb: 1,
                        p: 1,
                    }}>
                    Just In
                </Typography>

                <Fade in={show} timeout={500}>
                    <Box>
                        {currentNews ? (
                            <Box
                                sx={{
                                    backgroundImage: `url(${currentNews.image_url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    bgcolor: "grey.700",
                                    backgroundBlendMode: "multiply",
                                    p: 2,
                                    height: 200,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "common.white",
                                        fontFamily: "Arial Narrow, sans-serif",
                                        "&:hover": { color: "#003366" },
                                        cursor: "pointer",
                                    }}>
                                    {currentNews.title}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Loading latest updates...
                            </Typography>
                        )}
                    </Box>
                </Fade>
            </Box>

            {/* Action Button */}
            <Box
                component="button"
                sx={{
                    bgcolor: "#c00",
                    color: "white",
                    border: "none",
                    py: 1.5,
                    fontWeight: 900,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    "&:hover": { bgcolor: "#a00" },
                }}>
                Watch Trojan TV
            </Box>
        </Box>
    );
};

export default FloatingCard;
