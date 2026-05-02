import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { NavLink } from "react-router";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthContext } from "~/context/AuthContext";
import { useInvalidateCache } from "~/hooks/useCaching";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import { AppLogo } from "../buttons/AppName";

export default function UserSideNav({
    isMobile,
    drawerOpen,
    handleDrawerToggle,
    drawerWidth,
}: {
    isMobile: boolean;
    drawerOpen: boolean;
    handleDrawerToggle: () => void;
    drawerWidth: number;
}) {
    const { logout } = useAuthContext();
    const { queryClient } = useInvalidateCache();
    const { confirm } = useConfirmDialog();

    const handleLogout = async () => {
        const shouldLogout = await confirm({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            confirmText: "Yes",
            cancelText: "No",
            confirmColor: "warning",
        });

        if (shouldLogout) {
            logout();
            queryClient.clear();
        }
    };

    const navItems = [
        {
            text: "Dashboard",
            icon: <DashboardIcon fontSize="small" />,
            path: "/user/dashboard",
        },
        {
            text: "News",
            icon: <ArticleIcon fontSize="small" />,
            path: "/user/news",
        },
        {
            text: "Settings",
            icon: <SettingsIcon fontSize="small" />,
            path: "/user/settings",
        },
    ];

    return (
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        border: "none",
                        bgcolor: "primary.main",
                    },
                }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "common.white",
                        mb: 2,
                    }}>
                    <Box
                        sx={{
                            display:
                                isMobile || drawerOpen ? "flex" : "none",
                            alignItems: "center",
                        }}>
                        <AppLogo />
                        <Typography variant="body1">Journalist</Typography>
                    </Box>
                    {isMobile && (
                        <IconButton
                            size="small"
                            onClick={handleDrawerToggle}
                            color="inherit">
                            <CloseIcon color="inherit" fontSize="small" />
                        </IconButton>
                    )}
                </Toolbar>

                <List disablePadding dense>
                    {navItems.map((item) => (
                        <ListItem
                            key={item.text}
                            component={NavLink}
                            to={item.path}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                                color: "grey.50",
                                borderLeft: ".4rem solid transparent",
                                mb: 0.5,
                                "&.active": {
                                    bgcolor: "primary.light",
                                    borderColor: "common.white",
                                },
                            }}
                            dense
                            disablePadding>
                            <ListItemButton
                                sx={{
                                    justifyContent: drawerOpen
                                        ? "initial"
                                        : "center",
                                    px: drawerOpen ? 2 : 1,
                                }}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 32,
                                        color: "inherit",
                                        mr: drawerOpen ? 1 : 0,
                                    }}>
                                    {item.icon}
                                </ListItemIcon>
                                {drawerOpen && (
                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{
                                                    fontSize: ".8rem",
                                                    fontWeight: 600,
                                                }}>
                                                {item.text}
                                            </Typography>
                                        }
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem
                        component="div"
                        onClick={handleLogout}
                        sx={{ color: "grey.50", mt: 4 }}
                        dense
                        disablePadding>
                        <ListItemButton
                            sx={{
                                justifyContent: drawerOpen
                                    ? "initial"
                                    : "center",
                                px: drawerOpen ? 2 : 1,
                            }}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 32,
                                    color: "inherit",
                                    mr: drawerOpen ? 1 : 0,
                                }}>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary="Log out" />}
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}
