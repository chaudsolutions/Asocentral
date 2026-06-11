import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AppName from "../buttons/AppName";
import { useNewsCategories } from "~/hooks/useCaching";
import { NavLink, Link } from "react-router";
import type { NewsCategoryType } from "~/types/news";
import { useResponsive } from "~/hooks/useTools";
import SearchIcon from "@mui/icons-material/Search";
import { useNewsData } from "~/hooks/useCaching";
import SearchOverlay from "../news/SearchOverlay";
import TopMarquee from "./TopMarquee";

const MainLayoutHeader = () => {
    const { newsCategories = [], isNewsCategoriesLoading } =
        useNewsCategories();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { isMobile } = useResponsive();

    const { newsData = [], isNewsDataLoading } = useNewsData();

    const activeNews = newsData.filter(
        (n) => (n.active && n.isSystem) || !n._id,
    );

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
        fontSize: isMobile ? "0.65rem" : "0.85rem",
        textTransform: "uppercase" as const,
        fontFamily: "Arial Narrow, sans-serif",
        borderBottom: isActive ? "3px solid #c00" : "3px solid transparent",
        paddingBottom: "4px",
        transition: "color 0.2s",
    });

    const categoriesToDisplay = isMobile
        ? newsCategories.slice(0, 2)
        : newsCategories.slice(0, 7);

    return (
        <AppBar
            id="main-layout-header"
            position="fixed"
            sx={{ top: 0, bgcolor: "white", boxShadow: "none" }}>
            <TopMarquee />

            {/* Top Branding Bar */}
            <Box sx={{ bgcolor: "#003366", py: 1 }}>
                <Container maxWidth="xl">
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                        }}>
                        <AppName />

                        <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                            <IconButton
                                onClick={() => setIsSearchOpen(true)}
                                size="small"
                                sx={{ color: "white" }}>
                                <SearchIcon fontSize="small" />
                            </IconButton>

                            <Button
                                component={Link}
                                to="/auth/user"
                                variant="contained"
                                size="small"
                                sx={{
                                    bgcolor: "#c00",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    p: { xs: 1, md: 2 },
                                    fontSize: { xs: "0.6rem", md: "0.875rem" },
                                    "&:hover": { bgcolor: "#900" },
                                }}>
                                Publish News
                            </Button>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Navigation Bar */}
            <Toolbar variant="dense" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                <Container maxWidth="xl">
                    <Box
                        component="nav"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}>
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

                                <NavLink to="/profiles" style={navLinkStyle}>
                                    Profiles
                                </NavLink>

                                {/* 3. The "More" Dropdown */}
                                {newsCategories.length > 3 && (
                                    <>
                                        <Button
                                            onClick={handleOpenMenu}
                                            endIcon={<KeyboardArrowDownIcon />}
                                            sx={{
                                                color: "#222",
                                                fontWeight: 800,
                                                pb: 1.7,
                                                fontSize: {
                                                    xs: "0.65rem",
                                                    md: "0.85rem",
                                                },
                                                fontFamily:
                                                    "Arial Narrow, sans-serif",
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
                                                        index >= 2;
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
                                                                fontSize: {
                                                                    xs: "0.65rem",
                                                                    md: "0.85rem",
                                                                },
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

            <Box sx={{ position: "relative" }}>
                <SearchOverlay
                    open={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    data={activeNews}
                    loading={isNewsDataLoading}
                />
            </Box>
        </AppBar>
    );
};

export default MainLayoutHeader;
