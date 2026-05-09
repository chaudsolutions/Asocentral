import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LanguageIcon from "@mui/icons-material/Language";
import XIcon from "@mui/icons-material/X";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useParams } from "react-router";
import { useSinglePersonality } from "~/hooks/useCaching";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/personality-detail";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `Personality Profile | ${appName}`;
    const description =
        "Explore a featured personality profile on Trojan News, including background, impact, and official links.";
    const pageUrl = `${websiteUrl}/personality-of-the-week`;

    return [
        { title },
        { name: "description", content: description },
        {
            name: "keywords",
            content:
                "personality profile, trojan news, journalist profile, featured personality",
        },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo },
        { property: "og:url", content: pageUrl },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: appName },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },
    ];
}

export default function PersonalityDetail() {
    const { personalityId = "" } = useParams();
    const { personality, isSinglePersonalityLoading } =
        useSinglePersonality(personalityId);

    if (isSinglePersonalityLoading) {
        return <PersonalityDetailSkeleton />;
    }

    if (!personality) {
        return <Typography>Personality not found.</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 980, display: "grid", gap: 2.5 }}>
            <Box
                sx={{
                    borderBottom: "2px solid #111827",
                    pb: 1.5,
                }}>
                <Chip
                    label="Personality of the Week"
                    size="small"
                    sx={{
                        mb: 1,
                        width: "fit-content",
                        fontWeight: 700,
                        bgcolor: "#eef2ff",
                        color: "#1e3a8a",
                    }}
                />
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.6 }}>
                    {personality.title}
                </Typography>
            </Box>

            <Box
                component="img"
                src={personality.image}
                alt={personality.title}
                sx={{
                    width: "100%",
                    height: { xs: 260, md: 500 },
                    objectFit: "contain",
                    borderRadius: 1,
                    border: "1px solid #e5e7eb",
                }}
            />

            <Box
                sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 1,
                    p: { xs: 2, md: 2.5 },
                    bgcolor: "#fff",
                }}>
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.9,
                        fontSize: { xs: "1rem", md: "1.05rem" },
                    }}>
                    {personality.description}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.7} sx={{ flexWrap: "wrap" }}>
                <SocialLink
                    href={personality.website}
                    icon={<LanguageIcon fontSize="small" />}
                />
                <SocialLink
                    href={personality.socialLinks?.twitter}
                    icon={<XIcon fontSize="small" />}
                />
                <SocialLink
                    href={personality.socialLinks?.facebook}
                    icon={<FacebookOutlinedIcon fontSize="small" />}
                />
                <SocialLink
                    href={personality.socialLinks?.instagram}
                    icon={<InstagramIcon fontSize="small" />}
                />
                <SocialLink
                    href={personality.socialLinks?.linkedin}
                    icon={<LinkedInIcon fontSize="small" />}
                />
                <SocialLink
                    href={personality.socialLinks?.youtube}
                    icon={<YouTubeIcon fontSize="small" />}
                />
            </Stack>
        </Box>
    );
}

function SocialLink({ href, icon }: { href?: string; icon: ReactNode }) {
    if (!href) return null;
    return (
        <IconButton
            component="a"
            href={href}
            target="_blank"
            rel="noreferrer"
            size="small"
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

function PersonalityDetailSkeleton() {
    return (
        <Box sx={{ display: "grid", gap: 2 }}>
            <Skeleton variant="rounded" width={180} height={28} />
            <Skeleton variant="text" width="60%" height={54} />
            <Skeleton
                variant="rectangular"
                height={500}
                sx={{ borderRadius: 1 }}
            />
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 1 }} />
            <Stack direction="row" spacing={1}>
                {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                        key={item}
                        variant="rounded"
                        width={34}
                        height={34}
                    />
                ))}
            </Stack>
        </Box>
    );
}
