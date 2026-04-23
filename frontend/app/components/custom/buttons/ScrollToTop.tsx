import { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import Zoom from "@mui/material/Zoom";
import { useTheme } from "@mui/material/styles";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const theme = useTheme();

    // Calculate scroll progress
    const calculateScrollProgress = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const totalScroll = documentHeight - windowHeight;
        const progress = totalScroll > 0 ? (scrollY / totalScroll) * 100 : 0;

        setScrollProgress(progress);
        setIsVisible(scrollY > 300);
    };

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", calculateScrollProgress);
        return () =>
            window.removeEventListener("scroll", calculateScrollProgress);
    }, []);

    return (
        <Zoom in={isVisible}>
            <Box
                sx={{
                    position: "fixed",
                    bottom: theme.spacing(10),
                    right: theme.spacing(4),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                }}>
                <CircularProgress
                    variant="determinate"
                    value={scrollProgress}
                    size={56}
                    thickness={3}
                    color="warning"
                    sx={{
                        position: "absolute",
                        zIndex: 1,
                    }}
                />
                <Fab
                    color="primary"
                    aria-label="scroll to top"
                    onClick={scrollToTop}
                    sx={{
                        position: "relative",
                        zIndex: 4,
                        width: 40,
                        height: 40,
                        boxShadow: 3,
                        "&:hover": {
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.3s ease",
                    }}>
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Zoom>
    );
};

export default ScrollToTop;
