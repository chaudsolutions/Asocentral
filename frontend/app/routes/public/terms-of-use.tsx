import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/terms-of-use";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `Terms of Use | ${appName}`;
    const description =
        "Review the terms governing access, publishing, moderation, and acceptable use of the platform.";
    const pageUrl = `${websiteUrl}/terms-of-use`;

    return [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: websiteLogo },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
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
        title: "Acceptance of Terms",
        body: "By accessing or using this platform, you agree to these Terms of Use and all applicable laws. If you do not agree, you should not use the service.",
    },
    {
        title: "Eligibility and Accounts",
        body: "You are responsible for maintaining accurate account information and safeguarding your credentials. Account holders are responsible for activities performed under their authenticated sessions.",
    },
    {
        title: "Publishing and Editorial Workflow",
        body: "Content submitted by users may be reviewed, edited, approved, rejected, or removed based on editorial standards, legal risk, policy compliance, and platform integrity. Completion of KYC may be required before submission privileges are enabled.",
    },
    {
        title: "User Conduct",
        body: "You agree not to post unlawful, misleading, defamatory, abusive, hateful, infringing, or malicious material. Attempts to manipulate engagement metrics, disrupt operations, or bypass moderation controls are prohibited.",
    },
    {
        title: "Intellectual Property",
        body: "You retain rights to your original content but grant the platform a non-exclusive license to host, process, display, edit for formatting, and distribute submitted material as needed to operate the service.",
    },
    {
        title: "Comments and Community Participation",
        body: "Commenting features may be moderated. The platform may remove comments or limit interaction where needed to prevent abuse, spam, misinformation, or legal exposure.",
    },
    {
        title: "Third-Party Services",
        body: "The platform may rely on third-party services for storage, analytics, maps, media delivery, and notifications. Availability and performance may vary based on those providers.",
    },
    {
        title: "Disclaimers",
        body: "Services are provided on an as-available basis. While we aim for reliability and accuracy, we do not guarantee uninterrupted operation, error-free delivery, or completeness of all third-party content.",
    },
    {
        title: "Limitation of Liability",
        body: "To the maximum extent permitted by law, the platform and its operators are not liable for indirect, incidental, consequential, or special damages arising from service use, interruptions, or user-generated content.",
    },
    {
        title: "Suspension and Termination",
        body: "We may suspend, restrict, or terminate access for policy violations, security concerns, legal obligations, or misuse of platform features. We may also preserve records where required for compliance or dispute handling.",
    },
    {
        title: "Changes to Terms",
        body: "These terms may be updated periodically. Updates take effect when published. Continued use after changes are posted constitutes acceptance of the revised terms.",
    },
];

export default function TermsOfUse() {
    return (
        <Box sx={{ display: "grid", gap: 2.5, maxWidth: 980 }}>
            <Paper
                elevation={0}
                sx={{ p: { xs: 2, md: 3 }, border: "1px solid #e5e7eb" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                    Terms of Use
                </Typography>
                <Typography color="text.secondary">
                    Effective date: May 9, 2026. These terms define the rules
                    and responsibilities for using the platform.
                </Typography>
            </Paper>

            {sections.map((section) => (
                <Paper
                    key={section.title}
                    elevation={0}
                    sx={{ p: { xs: 2, md: 2.5 }, border: "1px solid #e5e7eb" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        {section.title}
                    </Typography>
                    <Typography
                        sx={{ lineHeight: 1.85, color: "text.secondary" }}>
                        {section.body}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}
