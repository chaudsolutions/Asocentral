import { fetchNewsData } from "~/hooks/useNewsDataApi";
import { useNewsData } from "~/hooks/useCaching";
import Hero from "~/components/public/home/Hero";
import NewsDisplay from "~/components/public/home/NewsDisplay";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import type { NewsDataType } from "~/types/news";
import { Link } from "react-router";
import type { AppSettingsType } from "~/types/settings";
import { serVer } from "~/utils/constants";
import type { Route } from "./+types/home";

const getPublicSettings = async (): Promise<AppSettingsType | null> => {
    try {
        const response = await fetch(`${serVer}/app/settings`);
        if (!response.ok) return null;
        const data = (await response.json()) as { settings?: AppSettingsType };
        return data.settings || null;
    } catch {
        return null;
    }
};

export async function loader() {
    // fetch news in SSR
    const newsData = await fetchNewsData();
    const settings = await getPublicSettings();

    return { newsData, settings };
}

export const meta = ({ loaderData }: Route.MetaArgs) => {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo =
        loaderData?.settings?.general?.logoUrl || "/favicon.png";
    const title = `${appName} | Breaking News, Latest Stories and World Updates`;
    const description = `Stay informed with ${appName}. Get real-time breaking news, deep investigations, and latest updates on politics, technology, and world events.`;
    const keywords = `breaking news, world news, politics today, technology updates, ${appName}, Nigeria news, global news network`;

    return [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { name: "author", content: appName },
        { name: "robots", content: "index, follow" },

        // Canonical URL
        { tagName: "link", rel: "canonical", href: websiteUrl },

        // Open Graph / Facebook
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo }, // Path to your hero-style OG image
        { property: "og:url", content: websiteUrl },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: appName },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },

        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },

        // Theme / Mobile
        { name: "theme-color", content: "#003366" }, // Your brand blue
        { name: "apple-mobile-web-app-title", content: appName },

        // Structured Data: NewsMediaOrganization
        {
            type: "application/ld+json",
            content: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsMediaOrganization",
                name: appName,
                url: websiteUrl,
                logo: websiteLogo,
                description: description,
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Lagos",
                    addressCountry: "NG",
                },
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${websiteUrl}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            }),
        },
    ];
};

export default function Home() {
    const { newsData = [], isNewsDataLoading } = useNewsData();

    const systemNews = newsData.filter((n) => n._id && n.active && n.isSystem);
    const externalApiNews = newsData.filter((n) => !n._id);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" },
                gap: 3,
            }}>
            <HomeLeftRail newsData={externalApiNews.slice(0, 12)} />
            <Box>
                <Hero
                    newsData={systemNews}
                    isNewsDataLoading={isNewsDataLoading}
                />
                <NewsDisplay
                    newsData={systemNews}
                    isNewsDataLoading={isNewsDataLoading}
                />
            </Box>
        </Box>
    );
}

function HomeLeftRail({ newsData }: { newsData: NewsDataType[] }) {
    return (
        <Box sx={{ display: { xs: "none", lg: "grid" }, gap: 2 }}>
            {newsData.map((news, index) => (
                <Box key={`${news.article_id}-${index}`}>
                    <Link
                        to={news._id ? `/news/${news.article_id}` : news.link}
                        target={news._id ? "_self" : "_blank"}
                        style={{ textDecoration: "none", color: "inherit" }}>
                        {news.image_url ? (
                            <Box
                                component="img"
                                src={news.image_url}
                                alt={news.title}
                                sx={{
                                    width: "100%",
                                    height: 160,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    mb: 1,
                                }}
                            />
                        ) : news.video_url ? (
                            <Box
                                component="video"
                                src={news.video_url}
                                controls
                                preload="metadata"
                                sx={{
                                    width: "100%",
                                    height: 160,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: "#111",
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 160,
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: "#eee",
                                }}
                            />
                        )}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                lineHeight: 1.25,
                                mb: 0.5,
                            }}>
                            {news.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}>
                            {news.description}
                        </Typography>
                    </Link>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}
        </Box>
    );
}
