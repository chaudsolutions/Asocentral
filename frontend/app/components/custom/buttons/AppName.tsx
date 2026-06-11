import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { NavLink } from "react-router";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import { usePublicSettings } from "~/hooks/useCaching";

const AppName = () => {
    const theme = useTheme();
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();
    const logoUrl = publicSettings?.general?.logoUrl || undefined;

    return (
        <Box
            component={NavLink}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                },
                textDecoration: "none",
                color: theme.palette.grey[50],
            }}
            to="/">
            {isPublicSettingsLoading ? (
                <>
                    <Skeleton
                        variant="circular"
                        width={35}
                        height={35}
                        sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
                    />
                    <Skeleton
                        variant="text"
                        width={140}
                        height={32}
                        sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
                    />
                </>
            ) : (
                <>
                    <Avatar sx={{ width: 35, height: 35 }} src={logoUrl} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: { md: "1.2rem", xs: ".8rem" },
                        }}>
                        {publicSettings?.general?.websiteName || "N/A"}
                    </Typography>
                </>
            )}
        </Box>
    );
};

export const AppLogo = () => {
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();
    if (isPublicSettingsLoading) {
        return (
            <Skeleton
                variant="circular"
                width={35}
                height={35}
                sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
            />
        );
    }
    return (
        <Avatar
            sx={{ width: 35, height: 35 }}
            src={publicSettings?.general?.logoUrl || undefined}
        />
    );
};

export default AppName;
