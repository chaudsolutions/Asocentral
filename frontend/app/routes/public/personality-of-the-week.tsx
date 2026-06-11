import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LanguageIcon from "@mui/icons-material/Language";
import XIcon from "@mui/icons-material/X";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router";
import { usePersonalities } from "~/hooks/useCaching";
import type { PersonalityType } from "~/types/personality";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/personality-of-the-week";
import { useLoaderData } from "react-router";
import { usePublicSettings } from "~/hooks/useCaching";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `Personality of the Week | ${appName}`;
    const description = `Meet outstanding journalists and voices shaping ${appName}. Explore featured personalities, their stories, and editorial impact.`;
    const pageUrl = `${websiteUrl}/profiles`;

    return [
        { title },
        { name: "description", content: description },
        {
            name: "keywords",
            content: `personality of the week, journalists, ${appName}, featured voices, newsroom`,
        },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
        { property: "og:image", content: websiteLogo },
        { property: "og:url", content: pageUrl },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },
    ];
}

export default function PersonalityOfTheWeek() {
    const data = useLoaderData<typeof loader>();
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();

    const settings = publicSettings || data.settings;
    const personalitySettings = settings?.personalityOfTheWeek;

    const { personalities = [], isPersonalitiesLoading } = usePersonalities();
    const [featured, ...rest] = personalities;

    const isLoading =
        isPersonalitiesLoading ||
        (isPublicSettingsLoading && !publicSettings && !data.settings);

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Box
                sx={{
                    borderBottom: "2px solid #111827",
                    pb: 1.5,
                }}>
                <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: "1.2rem", md: "1.75rem" } }}>
                    {personalitySettings?.title || "Personality of the Week"}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {personalitySettings?.summary ||
                        "Profiles of standout voices shaping the newsroom."}
                </Typography>
            </Box>

            {isLoading ? (
                <PersonalitySkeleton />
            ) : featured ? (
                <>
                    <Link
                        to={`/profiles/${featured._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1.2fr 1fr",
                                },
                                gap: 2,
                                border: "1px solid #e5e7eb",
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "#fff",
                            }}>
                            <Box
                                component="img"
                                src={featured.image}
                                alt={featured.title}
                                sx={{
                                    width: "100%",
                                    height: { xs: 260, md: 360 },
                                    objectFit: "cover",
                                }}
                            />
                            <Stack sx={{ p: 2.5, gap: 1.5 }}>
                                <Chip
                                    label="Featured"
                                    size="small"
                                    sx={{
                                        width: "fit-content",
                                        fontWeight: 700,
                                        bgcolor: "#eef2ff",
                                        color: "#1e3a8a",
                                    }}
                                />
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 900, lineHeight: 1.2, fontSize: { xs: "1rem", md: "1.5rem" } }}>
                                    {featured.title}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 6,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        lineHeight: 1.7,
                                    }}>
                                    {featured.description}
                                </Typography>
                                <PersonalityLinks item={featured} />
                            </Stack>
                        </Box>
                    </Link>

                    <Grid container spacing={2}>
                        {rest.map((item) => (
                            <Grid
                                key={item._id}
                                size={{ xs: 12, sm: 6, md: 4 }}>
                                <PersonalityCard item={item} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <Typography color="text.secondary">
                    No personalities available yet.
                </Typography>
            )}
        </Box>
    );
}

function PersonalityCard({ item }: { item: PersonalityType }) {
    return (
        <Link
            to={`/profiles/${item._id}`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <Box
                sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    transition: "transform .2s ease, box-shadow .2s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)",
                    },
                }}>
                <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                        width: "100%",
                        height: 210,
                        objectFit: "contain",
                    }}
                />
                <Box sx={{ p: 1.5 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, lineHeight: 1.3, fontSize: { xs: "0.85rem", md: "1.25rem" } }}>
                        {item.title}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <PersonalityLinks item={item} />
                    </Box>
                </Box>
            </Box>
        </Link>
    );
}

function PersonalityLinks({ item }: { item: PersonalityType }) {
    const links = item.socialLinks || {};
    const hasAny =
        Boolean(item.website) ||
        Boolean(links.twitter) ||
        Boolean(links.facebook) ||
        Boolean(links.instagram) ||
        Boolean(links.linkedin) ||
        Boolean(links.youtube);

    if (!hasAny) return null;

    return (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
            <SocialLink
                href={item.website}
                icon={<LanguageIcon fontSize="small" />}
            />
            <SocialLink
                href={links.twitter}
                icon={<XIcon fontSize="small" />}
            />
            <SocialLink
                href={links.facebook}
                icon={<FacebookOutlinedIcon fontSize="small" />}
            />
            <SocialLink
                href={links.instagram}
                icon={<InstagramIcon fontSize="small" />}
            />
            <SocialLink
                href={links.linkedin}
                icon={<LinkedInIcon fontSize="small" />}
            />
            <SocialLink
                href={links.youtube}
                icon={<YouTubeIcon fontSize="small" />}
            />
        </Stack>
    );
}

function SocialLink({ href, icon }: { href?: string; icon: ReactNode }) {
    if (!href) return null;
    return (
        <IconButton
            size="small"
            onClick={(e) => e.stopPropagation()}
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                color: "#111827",
                "&:hover": { bgcolor: "#f8fafc" },
            }}>
            {icon}
        </IconButton>
    );
}

function PersonalitySkeleton() {
    return (
        <Box sx={{ display: "grid", gap: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Skeleton
                        variant="rectangular"
                        height={360}
                        sx={{ borderRadius: 1 }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Skeleton
                        variant="rounded"
                        height={24}
                        width={90}
                        sx={{ mb: 2 }}
                    />
                    <Skeleton variant="text" height={44} width="90%" />
                    <Skeleton variant="text" height={32} width="100%" />
                    <Skeleton variant="text" height={32} width="100%" />
                    <Skeleton variant="text" height={32} width="94%" />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {[1, 2, 3].map((item) => (
                    <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Skeleton
                            variant="rectangular"
                            height={210}
                            sx={{ borderRadius: 1 }}
                        />
                        <Skeleton
                            variant="text"
                            height={36}
                            width="85%"
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
