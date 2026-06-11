import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AppName from "../buttons/AppName";
import { useNewsCategories, usePublicSettings } from "~/hooks/useCaching";
import { Link } from "react-router";
import Skeleton from "@mui/material/Skeleton";

const MainLayoutFooter = () => {
    const { newsCategories = [], isNewsCategoriesLoading } =
        useNewsCategories();
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();

    // Pick 5 random categories or just the first 5 for the footer
    const footerCategories = newsCategories.slice(0, 5);

    const footerLinkStyle = {
        textDecoration: "none",
        color: "#bbb",
        fontSize: { xs: "0.75rem", md: "0.85rem" },
        display: "block",
        marginBottom: "8px",
        "&:hover": { color: "#fff", textDecoration: "underline" },
    };

    const headerStyle = {
        color: "#fff",
        fontWeight: 900,
        textTransform: "uppercase",
        fontSize: { xs: "0.75rem", md: "0.9rem" },
        letterSpacing: "1px",
        marginBottom: "20px",
        fontFamily: "Arial Narrow, sans-serif",
    };

    return (
        <Box
            component="footer"
            sx={{ bgcolor: "#001a33", color: "#fff", pt: 8, pb: 4, mt: 10 }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Brand Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ mb: 2 }}>
                            <AppName />
                        </Box>
                        {isPublicSettingsLoading ? (
                            <Skeleton variant="text" width={280} height={24} />
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#888",
                                    maxWidth: "300px",
                                    lineHeight: 1.6,
                                }}>
                                {publicSettings?.general?.websiteDescription ||
                                    `${publicSettings?.general?.websiteName || ""}. Providing breaking news and world-class journalism.`}
                            </Typography>
                        )}
                    </Grid>

                    {/* Quick Categories Section */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography sx={headerStyle}>News</Typography>
                        {isNewsCategoriesLoading
                            ? [1, 2, 3].map((i) => (
                                  <Box key={i} sx={{ mb: 1 }}>
                                      <Skeleton
                                          variant="rectangular"
                                          height={20}
                                      />
                                  </Box>
                              ))
                            : footerCategories.map((cat) => (
                                  <Box
                                      key={cat.slug}
                                      component={Link}
                                      to={`/category/${cat.slug}`}
                                      sx={footerLinkStyle}>
                                      {cat.name}
                                  </Box>
                              ))}
                    </Grid>

                    {/* About Section */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography sx={headerStyle}>About</Typography>
                        <Box
                            component={Link}
                            to="/about-us"
                            sx={footerLinkStyle}>
                            About Us
                        </Box>
                        <Box
                            component={Link}
                            to="/contact-us"
                            sx={footerLinkStyle}>
                            Contact Us
                        </Box>
                        <Box component={Link} to="/faqs" sx={footerLinkStyle}>
                            FAQs
                        </Box>
                    </Grid>

                    {/* Legal Section */}
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Typography sx={headerStyle}>Legal</Typography>
                        <Box
                            component={Link}
                            to="/privacy-policy"
                            sx={footerLinkStyle}>
                            Privacy Policy
                        </Box>
                        <Box
                            component={Link}
                            to="/terms-of-use"
                            sx={footerLinkStyle}>
                            Terms of Use
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: "#002b55" }} />

                {/* Bottom Bar */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                        © {new Date().getFullYear()} {publicSettings?.general?.websiteName}. All rights reserved.
                        <br />
                        Quotes displayed in real-time or delayed by at least 15
                        minutes.
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 } }}>
                        {/* You can add Social Icons here later */}
                        <Typography variant="caption" sx={{ color: "#444" }}>
                            Powered by System & NewsData
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default MainLayoutFooter;
