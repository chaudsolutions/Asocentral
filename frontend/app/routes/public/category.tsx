import { useParams } from "react-router";
import { useNewsData } from "~/hooks/useCaching";
import type { Route } from "./+types/category";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NewsDisplay from "~/components/public/home/NewsDisplay";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export const meta = ({ params, loaderData }: Route.MetaArgs) => {
    const { categoryName } = params;
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";

    // Format the slug (e.g., 'breaking-news' -> 'Breaking News')
    const formattedTitle = categoryName
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const title = `${formattedTitle} | ${appName}`;
    const description = `Read the latest ${formattedTitle} news and breaking updates on ${appName}. Get in-depth analysis and real-time reporting from Lagos to the world.`;
    const canonicalUrl = `${websiteUrl}/category/${categoryName}`;

    return [
        { title },
        { name: "description", content: description },
        {
            name: "keywords",
            content: `${formattedTitle}, ${formattedTitle} news, ${appName} ${formattedTitle}, latest updates, ${categoryName} reports`,
        },
        { tagName: "link", rel: "canonical", href: canonicalUrl },

        // Open Graph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: appName },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },

        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },

        // Structured Data: WebPage
        {
            type: "application/ld+json",
            content: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: title,
                url: canonicalUrl,
                description: description,
                publisher: {
                    "@type": "NewsMediaOrganization",
                    name: appName,
                    url: websiteUrl,
                },
            }),
        },
    ];
};

export default function CategoryPage() {
    const { categoryName } = useParams<{ categoryName: string }>();
    const { newsData = [], isNewsDataLoading } = useNewsData();

    // Filter news by matching the slug or the category name string
    // This assumes your data might have the display name (e.g. "Politics")
    // while the URL has the slug (e.g. "politics")
    const filteredNews =
        newsData?.filter((n) =>
            n.category?.some((c) =>
                c
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .includes(categoryName?.toLowerCase() || ""),
            ),
        ) || [];

    // Helper to format the banner text
    const displayTitle = categoryName?.replace(/-/g, " ");

    return (
        <Box>
            {/* Category Banner */}
            <Box
                sx={{
                    bgcolor: "#003366", // Fox News Blue
                    color: "white",
                    py: 3,
                    px: 4,
                    mb: 4,
                    borderLeft: "8px solid #c00", // Signature red accent
                    display: "flex",
                    alignItems: "center",
                }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontFamily: "Arial Narrow, sans-serif",
                        fontSize: { xs: "1.8rem", md: "2.5rem" },
                        letterSpacing: "-1px",
                    }}>
                    {displayTitle}
                </Typography>
            </Box>

            {/* Reusing NewsDisplay for the list */}
            <NewsDisplay
                newsData={filteredNews}
                isNewsDataLoading={isNewsDataLoading}
            />

            {filteredNews.length === 0 && !isNewsDataLoading && (
                <Typography sx={{ py: 10, textAlign: "center", color: "#666" }}>
                    No recent stories found in this category.
                </Typography>
            )}
        </Box>
    );
}
