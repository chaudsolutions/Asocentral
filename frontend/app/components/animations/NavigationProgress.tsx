import { useNavigation } from "react-router";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect, useRef } from "react";
import NoSsr from "@mui/material/NoSsr";

const NavigationProgress = () => {
    const navigation = useNavigation();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const progressTimer = useRef<NodeJS.Timeout | null>(null);
    const resetTimer = useRef<NodeJS.Timeout | null>(null);

    // Use navigation.location to detect ANY navigation
    const isNavigating = Boolean(navigation.location);

    useEffect(() => {
        // Clear any existing timers
        if (progressTimer.current) clearTimeout(progressTimer.current);
        if (resetTimer.current) clearTimeout(resetTimer.current);

        if (isNavigating) {
            // Show progress bar and start progressing quickly
            setVisible(true);
            setProgress(0);

            // Simulate fast progress to 90%
            let currentProgress = 0;
            progressTimer.current = setInterval(() => {
                currentProgress = Math.min(currentProgress + 15, 90);
                setProgress(currentProgress);

                if (currentProgress >= 90) {
                    if (progressTimer.current)
                        clearInterval(progressTimer.current);
                }
            }, 100);
        } else if (visible) {
            // Complete to 100% when navigation finishes
            setProgress(100);

            // Hide after a short delay
            resetTimer.current = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        }

        return () => {
            if (progressTimer.current) clearInterval(progressTimer.current);
            if (resetTimer.current) clearTimeout(resetTimer.current);
        };
    }, [isNavigating, visible]);

    if (!visible) return null;

    return (
        <NoSsr>
            <LinearProgress
                variant="determinate"
                value={progress}
                color="error"
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    height: "4px",
                    "& .MuiLinearProgress-bar": {
                        transition:
                            progress < 90 ? "transform 0.1s linear" : "none",
                    },
                }}
            />
        </NoSsr>
    );
};

export default NavigationProgress;
