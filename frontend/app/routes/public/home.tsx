import { fetchNewsData } from "~/hooks/useNewsDataApi";
import { useNewsData } from "~/hooks/useCaching";
import Hero from "~/components/public/home/Hero";
import NewsDisplay from "~/components/public/home/NewsDisplay";
import { appName, websiteLogo, websiteUrl } from "~/utils/constants";

export async function loader() {
    // fetch news in SSR
    const newsData = await fetchNewsData();

    return { newsData };
}

export const meta = () => {
    const title = `${appName} | Breaking News, Latest Stories and World Updates`;
    const description =
        "Stay informed with Trojan News Network. Get real-time breaking news, deep investigations, and latest updates on politics, technology, and world events from Lagos to the world.";
    const keywords =
        "breaking news, world news, politics today, technology updates, Trojan News, Nigeria news, global news network";

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
        { tagName: "link", rel: "icon", href: "/favicon.ico", sizes: "any" },

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

    const activeNews = newsData.filter((n) => n.active);

    return (
        <>
            <Hero newsData={activeNews} isNewsDataLoading={isNewsDataLoading} />

            <NewsDisplay
                newsData={activeNews}
                isNewsDataLoading={isNewsDataLoading}
            />
        </>
    );
}
