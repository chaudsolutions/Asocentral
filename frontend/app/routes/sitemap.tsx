import { getNewsCategories } from "~/hooks/useNewsCategories";
import {
    fetchNewsData,
    fetchPersonalities,
    fetchPublicSettings,
} from "~/hooks/useNewsDataApi";

// Helper function to escape XML special characters
const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (char) => {
        switch (char) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
            default:
                return char;
        }
    });
};

export async function loader() {
    const settings = await fetchPublicSettings();
    const categories = await getNewsCategories();
    const newsData = await fetchNewsData();
    const profiles = await fetchPersonalities();

    const { general } = settings;

    // website url
    const websiteUrl = general?.websiteUrl || "";

    // categories links
    const categoriesLinks = categories.map((cat) => `/category/${cat.slug}`);

    // news links
    const newsLinks = newsData.map((news) => `/news/${news.article_id}`);

    // profiles links
    const profilesLinks = profiles.map((profile) => `/profiles/${profile._id}`);

    const staticUrls = [
        "/",
        "/about-us",
        "/contact-us",
        "/faqs",
        "/privacy-policy",
        "/terms-of-use",
        "/profiles",
    ];

    // combine all links
    const allLinks = [
        ...staticUrls,
        ...categoriesLinks,
        ...newsLinks,
        ...profilesLinks,
    ].filter((url, index, self) => self.indexOf(url) === index); // remove duplicates

    // generate XML Sitemap with proper formatting
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                            ${allLinks
                                .map((url) => {
                                    const fullUrl = `${websiteUrl}${
                                        url.startsWith("/") ? url : `/${url}`
                                    }`;

                                    return `
                                            <url>
                                                <loc>${escapeXml(fullUrl)}</loc>
                                                <lastmod>${new Date().toISOString()}</lastmod>
                                                <changefreq>weekly</changefreq>
                                                <priority>${
                                                    url === "/" ? "1.0" : "0.8"
                                                }</priority>
                                            </url>`;
                                })
                                .join("")}
                        </urlset>`.trim();

    return new Response(sitemap, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control":
                "public, max-age=3600, stale-while-revalidate=3600",
        },
    });
}
