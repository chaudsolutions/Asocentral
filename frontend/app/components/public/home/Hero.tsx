import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import type { NewsDataType } from "~/types/news";

interface HeroProps {
    newsData: NewsDataType[];
    isNewsDataLoading: boolean;
}

const Hero = ({ newsData, isNewsDataLoading }: HeroProps) => {
    // 1. Setup Embla with Autoplay
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    // Slice first 3 for the Hero
    const topStories = newsData?.slice(0, 3) || [];

    if (isNewsDataLoading) {
        return (
            <Skeleton
                variant="rectangular"
                width="100%"
                height={500}
                sx={{ borderRadius: 1 }}
            />
        );
    }

    return (
        <Box
            className="embla"
            ref={emblaRef}
            sx={{
                overflow: "hidden",
                position: "relative",
                borderRadius: 0, // Fox news uses sharp edges
                width: "100%",
                height: { xs: 350, md: 500 },
                cursor: "pointer",
            }}>
            <Box className="embla__container" sx={{ display: "flex" }}>
                {topStories.map((article, index) => (
                    <Box
                        key={index}
                        className="embla__slide"
                        sx={{
                            flex: "0 0 100%",
                            minWidth: 0,
                            position: "relative",
                        }}>
                        {/* Article Image */}
                        {article.image_url ? (
                            <Box
                                component="img"
                                src={article.image_url}
                                alt={article.title}
                                sx={{
                                    width: "100%",
                                    height: { xs: 350, md: 500 },
                                    objectFit: "cover",
                                    filter: "brightness(0.7)", // Darken to make text pop
                                }}
                            />
                        ) : article.video_url ? (
                            <Box
                                component="video"
                                src={article.video_url}
                                controls
                                muted
                                preload="metadata"
                                sx={{
                                    width: "100%",
                                    height: { xs: 350, md: 500 },
                                    objectFit: "cover",
                                    filter: "brightness(0.7)",
                                    bgcolor: "#111",
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: { xs: 350, md: 500 },
                                    bgcolor: "#ddd",
                                }}
                            />
                        )}

                        {/* Text Overlay - Fox News Style */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                p: { xs: 3, md: 5 },
                                background:
                                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                                color: "white",
                            }}>
                            {/* "TOP STORY" Tag */}
                            <Typography
                                variant="caption"
                                sx={{
                                    bgcolor: "#c00",
                                    color: "white",
                                    px: 1.5,
                                    py: 0.5,
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    mb: 1,
                                    display: "inline-block",
                                }}>
                                Top Story
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: { xs: "1.5rem", md: "2.8rem" },
                                    fontWeight: 900,
                                    lineHeight: 1.1,
                                    fontFamily: "Arial Narrow, sans-serif",
                                    textTransform: "uppercase",
                                    mb: 2,
                                    maxWidth: "900px",
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                                }}>
                                {article.title}
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    display: { xs: "none", md: "-webkit-box" },
                                    overflow: "hidden",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    maxWidth: "700px",
                                    color: "rgba(255,255,255,0.8)",
                                }}>
                                {article.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Hero;
