import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/privacy-policy";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `Privacy Policy | ${appName}`;
    const description =
        "Learn what information we collect, why we collect it, and how we secure and process your data.";
    const pageUrl = `${websiteUrl}/privacy-policy`;

    return [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
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

const sections = [
    {
        title: "Information We Collect",
        body: "We collect account details such as name, email, and role to create and manage user access. When users submit KYC, we collect identity and address details required for newsroom verification. We also collect content-related data including draft submissions, published stories, comments, views, downloads, and sharing activity.",
    },
    {
        title: "How We Collect Information",
        body: "Information is collected directly when you register, update profile settings, complete KYC, publish content, or contact support. We also receive technical metadata such as browser session identifiers used for engagement counters and anti-abuse protection.",
    },
    {
        title: "How We Use Information",
        body: "We use your data to operate the platform, verify journalist eligibility, moderate and publish content, send service notifications, generate analytics, and improve product performance. We may use aggregate insights for reporting, but we do not sell personal data.",
    },
    {
        title: "Cookies and Session Technologies",
        body: "We use local/session storage and related browser mechanisms to support core features, including authentication state, bookmarking, article engagement tracking, and anonymous commenting controls.",
    },
    {
        title: "Data Sharing",
        body: "We share information only when required to deliver platform services, such as cloud infrastructure, media storage, email delivery, and security monitoring providers. These processors handle data under contractual confidentiality and security obligations.",
    },
    {
        title: "Media and Uploaded Files",
        body: "Uploaded media files, including profile images, article assets, and KYC files, may be stored in managed cloud object storage. Access is restricted to authorized workflows and role-based admin processes.",
    },
    {
        title: "Retention and Deletion",
        body: "We retain data only as long as necessary for service operations, legal obligations, fraud prevention, and editorial accountability. You may request account updates or deletion, subject to legal, security, and platform integrity requirements.",
    },
    {
        title: "Security Measures",
        body: "We use industry-standard safeguards including authentication controls, encrypted transit channels, access restrictions, and operational monitoring. No system is completely risk-free, but we continuously improve our controls and incident response readiness.",
    },
    {
        title: "Your Rights and Choices",
        body: "Depending on your location, you may have rights to access, correct, export, or delete your personal information. You may also request clarification on how your data is processed for publishing, moderation, and analytics.",
    },
    {
        title: "Policy Updates",
        body: "We may update this policy as the platform evolves. Material updates will be reflected on this page with a revised effective date. Continued use of the platform indicates acceptance of the updated policy.",
    },
];

export default function PrivacyPolicy() {
    return (
        <Box sx={{ display: "grid", gap: 2.5, maxWidth: 980 }}>
            <Paper
                elevation={0}
                sx={{ p: { xs: 2, md: 3 }, border: "1px solid #e5e7eb" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.2rem", md: "1.75rem" } }}>
                    Privacy Policy
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}>
                    Effective date: May 9, 2026. This policy explains how
                    information is collected, used, and protected across the
                    platform.
                </Typography>
            </Paper>

            {sections.map((section) => (
                <Paper
                    key={section.title}
                    elevation={0}
                    sx={{ p: { xs: 2, md: 2.5 }, border: "1px solid #e5e7eb" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: "0.85rem", md: "1.25rem" } }}>
                        {section.title}
                    </Typography>
                    <Typography
                        sx={{ lineHeight: 1.85, color: "text.secondary", fontSize: { xs: "0.85rem", md: "1rem" } }}>
                        {section.body}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}
