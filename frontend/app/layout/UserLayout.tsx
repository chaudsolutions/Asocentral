import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import NoSsr from "@mui/material/NoSsr";
import { useAuthContext } from "~/context/AuthContext";
import { useResponsive } from "~/hooks/useTools";
import { useUserData } from "~/hooks/useCaching";
import PageLoader from "~/components/animations/PageLoader";
import UserSideNav from "~/components/custom/navigation/UserSideNav";
import NotificationMenu from "~/components/custom/notification/NotificationMenu";

const drawerWidth = 240;
const collapsedDrawerWidth = 72;

export default function UserLayout() {
    const { userToken, isCheckingAuth } = useAuthContext();
    const { userData, isUserDataLoading } = useUserData();
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const activeDrawerWidth = drawerOpen ? drawerWidth : collapsedDrawerWidth;

    useEffect(() => {
        if (
            !isCheckingAuth &&
            (!userToken || (userData && userData.role !== "user"))
        ) {
            navigate("/auth/user");
        }
    }, [userToken, userData, isCheckingAuth, navigate]);

    if (isUserDataLoading || isCheckingAuth) {
        return <PageLoader />;
    }

    return (
        <NoSsr>
            <AppBar
                position="sticky"
                sx={{
                    ml: { md: `${activeDrawerWidth}px` },
                    width: { md: `calc(100% - ${activeDrawerWidth}px)` },
                }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Journalist Dashboard
                    </Typography>
                    <Box sx={{ ml: "auto" }}>
                        <NotificationMenu />
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: "flex", width: "100%" }}>
                <UserSideNav
                    isMobile={isMobile}
                    drawerOpen={drawerOpen}
                    handleDrawerToggle={() => setDrawerOpen(!drawerOpen)}
                    drawerWidth={isMobile ? drawerWidth : activeDrawerWidth}
                />
                <Container
                    maxWidth="xl"
                    component="main"
                    sx={{
                        p: { xs: 2, md: 3 },
                        minHeight: "calc(100vh - 5rem)",
                        width: "100%",
                    }}>
                    <Outlet />
                </Container>
            </Box>
        </NoSsr>
    );
}
