import { fetchPublicSettings } from "~/hooks/useNewsDataApi";

export async function loader() {
    const lastModified = new Date().toISOString();

    const settings = await fetchPublicSettings();

    const { general } = settings;

    // website url
    const websiteUrl = general?.websiteUrl || "";

    const content = `
                    # robots.txt generated at ${lastModified}
                    User-agent: *
                    Allow: /
                    Disallow: /user/*
                    Disallow: /admin/*
                    Disallow: /api/*
                    Crawl-delay: 10
                    
                    Sitemap: ${websiteUrl}/sitemap.xml
                    
                    # Google-specific rules
                    User-agent: Googlebot
                    Allow: /category/
                    Allow: /news/
                    Allow: /profiles/
                    
                    # Bing-specific rules
                    User-agent: Bingbot
                    Allow: /category/
                    Allow: /news/
                    Allow: /profiles/
                    Crawl-delay: 5
                    `.trim();

    return new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
        },
    });
}
