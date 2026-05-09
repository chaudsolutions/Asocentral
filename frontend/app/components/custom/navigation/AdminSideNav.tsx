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
import Tooltip from "@mui/material/Tooltip";
// icons
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "~/context/AuthContext";
import { useInvalidateCache } from "~/hooks/useCaching";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import { AppLogo } from "../buttons/AppName";

const AdminSideNav = ({
    isMobile,
    drawerOpen,
    handleDrawerToggle,
    drawerWidth,
}: {
    isMobile: boolean;
    drawerOpen: boolean;
    handleDrawerToggle: () => void;
    drawerWidth: number;
}) => {
    const theme = useTheme();

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
            icon: <GridViewOutlinedIcon fontSize="small" />,
            path: "dashboard",
        },
        {
            text: "Users",
            icon: <ViewInArOutlinedIcon fontSize="small" />,
            path: "users",
        },
        {
            text: "News",
            icon: <BusinessOutlinedIcon fontSize="small" />,
            path: "news",
        },
        {
            text: "Personality",
            icon: <EmojiPeopleOutlinedIcon fontSize="small" />,
            path: "personality",
        },
        {
            text: "Categories",
            icon: <SettingsIcon fontSize="small" />,
            path: "category",
        },
        {
            text: "Settings",
            icon: <TuneOutlinedIcon fontSize="small" />,
            path: "settings",
            separator: true,
        },
        {
            text: "Log out",
            icon: <LogoutIcon fontSize="small" />,
            path: "logout",
            isLogout: true, // Marker for logout action
        },
    ];

    return (
        <>
            <Box
                component="nav"
                sx={{
                    width: { lg: drawerWidth },
                    flexShrink: { sm: 0 },
                    scrollbarWidth: "thin",
                }}>
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            overflowX:
                                isMobile || drawerOpen ? "auto" : "hidden",
                            scrollbarWidth: "thin",
                            border: "none",
                            backgroundColor: "primary.main",
                            transition: theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration:
                                    theme.transitions.duration.leavingScreen,
                            }),
                        },
                    }}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "common.white",
                            px: drawerOpen ? 2 : 1.5,
                            mb: 2,
                        }}>
                        {/* AppName/Header Text: Only show when drawer is fully open or on mobile */}
                        <Box
                            sx={{
                                display: "flex",
                                width: "100%",
                                gap: 1,
                                alignItems: "center",
                            }}>
                            <AppLogo />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                }}>
                                Admin
                            </Typography>
                        </Box>

                        {/* Mobile Close Button */}
                        {isMobile && (
                            <IconButton
                                size="small"
                                onClick={handleDrawerToggle}
                                color="inherit">
                                <CloseIcon color="inherit" fontSize="small" />
                            </IconButton>
                        )}
                    </Toolbar>

                    <Box sx={{ flexGrow: 1 }}>
                        <List disablePadding dense>
                            {navItems.map((item) => {
                                const componentProps = item.isLogout
                                    ? {
                                          component: "div",
                                          onClick: handleLogout,
                                      }
                                    : {
                                          component: NavLink,
                                          to: `/admin/${item.path}`,
                                          onClick: isMobile
                                              ? handleDrawerToggle
                                              : () => {},
                                      };

                                // Wrap the ListItem in a Tooltip when drawer is closed (icon-only view)
                                const listItemContent = (
                                    <ListItem
                                        {...componentProps}
                                        key={item.text}
                                        sx={{
                                            color: theme.palette.grey[50],
                                            borderLeft: `.4rem solid`,
                                            borderColor: "transparent",
                                            mb: 0.5,
                                            "&:hover": {
                                                bgcolor:
                                                    theme.palette.action.hover,
                                            },
                                            "&.active": {
                                                bgcolor:
                                                    theme.palette.primary.light,
                                                color: "common.white",
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
                                                px: drawerOpen ? 2.5 : 1,
                                            }}>
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 25,
                                                    color: "inherit",
                                                    mr: drawerOpen ? 1.5 : 0,
                                                }}>
                                                {item.icon}
                                            </ListItemIcon>

                                            {drawerOpen && (
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "0.8rem",
                                                                fontWeight: 600,
                                                            }}>
                                                            {item.text}
                                                        </Typography>
                                                    }
                                                />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                );

                                // Only show tooltip when drawer is closed (icon-only mode)
                                if (!drawerOpen) {
                                    return (
                                        <Box key={item.text}>
                                            {/* Visual separator for the Settings/Logout group */}
                                            {item.separator && (
                                                <Box sx={{ my: 6 }} />
                                            )}

                                            <Tooltip
                                                title={item.text}
                                                placement="right"
                                                arrow
                                                slotProps={{
                                                    tooltip: {
                                                        sx: {
                                                            bgcolor:
                                                                "common.white",
                                                            color: "text.primary",
                                                            fontSize: "0.75rem",
                                                            fontWeight: 500,
                                                            boxShadow: 2,
                                                            "& .MuiTooltip-arrow":
                                                                {
                                                                    color: "common.white",
                                                                },
                                                        },
                                                    },
                                                }}>
                                                {listItemContent}
                                            </Tooltip>
                                        </Box>
                                    );
                                }

                                return (
                                    <Box key={item.text}>
                                        {item.separator && (
                                            <Box sx={{ my: 6 }} />
                                        )}
                                        {listItemContent}
                                    </Box>
                                );
                            })}
                        </List>
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default AdminSideNav;
