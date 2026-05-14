import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import HomeIcon from "@mui/icons-material/Home";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import Stack from "@mui/material/Stack";
import { Link } from "react-router";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/404";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

// SEO Meta Function
export const meta = ({ loaderData }: Route.MetaArgs) => {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const pageUrl = `${websiteUrl}/404`;
    const title = `Page Not Found | ${appName}`;
    const description =
        "The page you are looking for does not exist or has been moved. Return to our homepage for the latest breaking news and updates.";

    return [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },

        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo },
        { property: "og:url", content: pageUrl },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: appName },

        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },
    ];
};

export default function NotFound() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "70vh",
                    textAlign: "center",
                    py: 5,
                }}>
                {/* Visual Icon/Logo Node */}
                <Box
                    sx={{
                        position: "relative",
                        display: "inline-flex",
                        mb: 4,
                    }}>
                    <NewspaperIcon
                        sx={{
                            fontSize: 120,
                            color: "grey.200",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 0,
                        }}
                    />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "6rem", md: "10rem" },
                            fontWeight: 900,
                            color: "#003366",
                            position: "relative",
                            zIndex: 1,
                            lineHeight: 1,
                        }}>
                        404
                    </Typography>
                </Box>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "text.primary" }}>
                    Headline Not Found
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, maxWidth: "500px" }}>
                    The story you are looking for has been moved, archived, or
                    does not exist. Stay informed by heading back to our latest
                    updates.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        size="large"
                        startIcon={<HomeIcon />}
                        sx={{
                            bgcolor: "#003366",
                            px: 4,
                            py: 1.5,
                            borderRadius: "8px",
                            "&:hover": { bgcolor: "#002244" },
                        }}>
                        Back to Homepage
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => window.history.back()}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: "8px",
                            borderColor: "#003366",
                            color: "#003366",
                        }}>
                        Previous Page
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}
