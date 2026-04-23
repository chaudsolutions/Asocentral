import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { appName } from "../../../utils/constants";
import { NavLink } from "react-router";
import Avatar from "@mui/material/Avatar";
import { useImagesPath } from "~/hooks/useImagesPath";

const AppName = () => {
    const theme = useTheme();
    const { logo } = useImagesPath();

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
            <Avatar sx={{ width: 35, height: 35 }} src={logo} />
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    fontSize: "1.2rem",
                }}>
                {appName}
            </Typography>
        </Box>
    );
};

export const AppLogo = () => {
    const { logo } = useImagesPath();
    return <Avatar sx={{ width: 35, height: 35 }} src={logo} />;
};

export default AppName;
