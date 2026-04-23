import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AppName from "../buttons/AppName";
import { useNewsCategories } from "~/hooks/useCaching";
import { NavLink, Link } from "react-router";
import type { NewsCategoryType } from "~/types/news";
import { useResponsive } from "~/hooks/useTools";

const MainLayoutHeader = () => {
    const { newsCategories = [], isNewsCategoriesLoading } =
        useNewsCategories();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { isMobile } = useResponsive();

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Shared NavLink Style
    const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
        textDecoration: "none",
        color: isActive ? "#c00" : "#222",
        fontWeight: 800,
        fontSize: "0.85rem",
        textTransform: "uppercase" as const,
        fontFamily: "Arial Narrow, sans-serif",
        borderBottom: isActive ? "3px solid #c00" : "3px solid transparent",
        paddingBottom: "4px",
        transition: "color 0.2s",
    });

    const categoriesToDisplay = isMobile
        ? newsCategories.slice(0, 3)
        : newsCategories.slice(0, 7);

    return (
        <AppBar position="static" sx={{ bgcolor: "white", boxShadow: "none" }}>
            {/* Top Branding Bar */}
            <Box sx={{ bgcolor: "#003366", py: 1 }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AppName />
                    </Box>
                </Container>
            </Box>

            {/* Navigation Bar */}
            <Toolbar variant="dense" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                <Container maxWidth="xl">
                    <Box
                        component="nav"
                        sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        {isNewsCategoriesLoading ? (
                            <Skeleton width={200} height={30} />
                        ) : (
                            <>
                                {/* 1. Always Visible (First 3) */}
                                {categoriesToDisplay.map((category) => (
                                    <NavLink
                                        key={category.slug}
                                        to={`/category/${category.slug}`}
                                        style={navLinkStyle}>
                                        {category.name}
                                    </NavLink>
                                ))}

                                {/* 3. The "More" Dropdown */}
                                {newsCategories.length > 3 && (
                                    <>
                                        <Button
                                            onClick={handleOpenMenu}
                                            endIcon={<KeyboardArrowDownIcon />}
                                            sx={{
                                                color: "#222",
                                                fontWeight: 800,
                                                fontSize: "0.85rem",
                                                fontFamily:
                                                    "Arial Narrow, sans-serif",
                                                minWidth: "auto",
                                                p: 0,
                                                "&:hover": {
                                                    bgcolor: "transparent",
                                                    color: "#c00",
                                                },
                                            }}>
                                            More
                                        </Button>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleCloseMenu}
                                            disableScrollLock // Prevents layout shift
                                        >
                                            {newsCategories.map(
                                                (
                                                    category: NewsCategoryType,
                                                    index: number,
                                                ) => {
                                                    // On Mobile (xs), show everything from index 3 onwards in Menu
                                                    // On Desktop (md), show everything from index 7 onwards in Menu
                                                    const isHiddenOnMobile =
                                                        index >= 3;
                                                    const isHiddenOnDesktop =
                                                        index >= 7;

                                                    return (
                                                        <MenuItem
                                                            key={category.slug}
                                                            onClick={
                                                                handleCloseMenu
                                                            }
                                                            component={Link}
                                                            to={`/category/${category.slug}`}
                                                            sx={{
                                                                display:
                                                                    isHiddenOnDesktop
                                                                        ? "flex"
                                                                        : {
                                                                              xs: isHiddenOnMobile
                                                                                  ? "flex"
                                                                                  : "none",
                                                                              md: "none",
                                                                          },
                                                                textTransform:
                                                                    "uppercase",
                                                                fontWeight: 700,
                                                                fontSize:
                                                                    "0.8rem",
                                                            }}>
                                                            {category.name}
                                                        </MenuItem>
                                                    );
                                                },
                                            )}
                                        </Menu>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default MainLayoutHeader;
