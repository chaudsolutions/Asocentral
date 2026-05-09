import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/ad-choices";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `Ad Choices | ${appName}`;
    const description =
        `Learn how sponsored content and advertising placements are handled on ${appName}.`;
    const pageUrl = `${websiteUrl}/ad-choices`;

    return [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo },
        { property: "og:url", content: pageUrl },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: appName },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: websiteLogo },
    ];
}

export default function AdChoices() {
    return (
        <Box sx={{ maxWidth: 900 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                Ad Choices
            </Typography>
            <Typography sx={{ lineHeight: 1.8 }}>
                Trojan News may display sponsored placements. We separate
                sponsored content from editorial reporting and label promotions
                clearly for transparency.
            </Typography>
        </Box>
    );
}
