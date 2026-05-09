import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import { usePublicSettings } from "~/hooks/useCaching";

const TopMarquee = () => {
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();
    const text = publicSettings?.general?.marqueeText?.trim();
    const tickerItems = Array.from({ length: 8 }, (_, index) => (
        <Typography
            key={`ticker-item-${index}`}
            component="span"
            sx={{
                color: "#111827",
                fontWeight: 700,
                fontSize: "0.9rem",
            }}>
            {text}
            <Box
                component="span"
                sx={{ display: "inline-block", px: 1.5, color: "#6b7280" }}>
                •
            </Box>
        </Typography>
    ));

    if (isPublicSettingsLoading) {
        return (
            <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #e5e7eb", py: 0.75 }}>
                <Skeleton variant="text" sx={{ mx: 2 }} />
            </Box>
        );
    }
    if (!text) return null;

    return (
        <Box
            sx={{
                bgcolor: "#fff",
                borderBottom: "1px solid #e5e7eb",
                py: 0.75,
            }}>
            <MarqueeText
                duration={32}
                pauseOnHover
                textSpacing="2rem"
                direction="right"
                playOnlyInView={false}>
                {tickerItems}
            </MarqueeText>
        </Box>
    );
};

export default TopMarquee;
