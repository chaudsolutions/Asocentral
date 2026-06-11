import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useLoaderData } from "react-router";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import { usePublicSettings } from "~/hooks/useCaching";
import type { Route } from "./+types/about-us";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const name = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `About Us | ${name}`;
    const description =
        loaderData?.settings?.aboutUs?.summary ||
        "Learn more about our newsroom, mission, and editorial values.";
    const pageUrl = `${websiteUrl}/about-us`;
    return [
        { title },
        { name: "description", content: description },
        {
            name: "keywords",
            content: "about us, newsroom, mission, editorial standards",
        },

        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo },
        { property: "og:url", content: pageUrl },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: name },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },
    ];
}

export default function AboutUs() {
    const data = useLoaderData<typeof loader>();
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();
    const settings = publicSettings || data.settings;
    const sections = settings?.aboutUs?.sections || [];

    if (isPublicSettingsLoading && !publicSettings && !data.settings) {
        return (
            <Box sx={{ display: "grid", gap: 2 }}>
                <Skeleton variant="rounded" height={140} />
                <Skeleton variant="rounded" height={220} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "grid", gap: 2.5 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3 },
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fff",
                }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.2rem", md: "1.75rem" } }}>
                    {settings?.aboutUs?.title || "About Us"}
                </Typography>
                <Typography sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                    {settings?.aboutUs?.summary || "N/A"}
                </Typography>
            </Paper>

            <Grid container spacing={2}>
                {sections.map((section, index: number) => (
                    <Grid
                        key={`${section.title || "section"}-${index}`}
                        size={{ xs: 12 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #e5e7eb",
                                bgcolor: "#fff",
                            }}>
                            {section.image && (
                                <Box
                                    component="img"
                                    src={section.image}
                                    alt={
                                        section.title ||
                                        `About section ${index + 1}`
                                    }
                                    sx={{
                                        width: "100%",
                                        height: { xs: 220, md: 320 },
                                        objectFit: "cover",
                                        borderRadius: 1,
                                        mb: 1.5,
                                    }}
                                />
                            )}
                            {section.title && (
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 800, mb: 1, fontSize: { xs: "0.85rem", md: "1.25rem" } }}>
                                    {section.title}
                                </Typography>
                            )}
                            <Typography
                                sx={{
                                    lineHeight: 1.8,
                                    color: "text.secondary",
                                }}>
                                {section.description || "N/A"}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {!sections.length && (
                <Typography color="text.secondary">N/A</Typography>
            )}
        </Box>
    );
}
