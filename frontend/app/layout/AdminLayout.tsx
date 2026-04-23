import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NoSsr from "@mui/material/NoSsr";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthContext } from "~/context/AuthContext";
import PageLoader from "~/components/animations/PageLoader";
import { useResponsive } from "~/hooks/useTools";
import { useAdminData } from "~/hooks/useCaching";
import AdminSideNav from "~/components/custom/navigation/AdminSideNav";

const drawerWidth = 240;

export default function AdminLoggedWrapper() {
    const { user, isCheckingAuth } = useAuthContext();
    const { adminData, isAdminDataLoading } = useAdminData();
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(() => {
        if (
            !isCheckingAuth &&
            (!user || (adminData && adminData?.role !== "admin"))
        ) {
            navigate("/");
        }
    }, [adminData, navigate]);

    if (isAdminDataLoading || isCheckingAuth) {
        return <PageLoader />;
    }

    return (
        <NoSsr>
            <AppBar
                position="sticky"
                sx={{
                    ml: { md: `${drawerWidth}px` },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }}>
                <Toolbar>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mr: 5,
                        }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 1,
                                display: { xs: "block", md: "none" },
                            }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Admin Dashboard
                        </Typography>
                    </Box>

                    {/* <AdminNotificationsBtn /> */}
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                }}>
                <AdminSideNav
                    isMobile={isMobile}
                    drawerOpen={drawerOpen}
                    handleDrawerToggle={handleDrawerToggle}
                    drawerWidth={drawerWidth}
                />
                <Box
                    component="main"
                    sx={{
                        p: 1,
                        minHeight: "calc(100vh - 5rem)",
                        width: "100%",
                    }}>
                    <Outlet /> {/* Nested route components render here */}
                </Box>
            </Box>
        </NoSsr>
    );
}
