import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Link } from "react-router";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import { usePublicSettings } from "~/hooks/useCaching";
import type { Route } from "./+types/faqs";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `FAQs | ${appName}`;
    const description =
        loaderData?.settings?.faqs?.summary ||
        "Find answers to common questions about the platform.";
    const pageUrl = `${websiteUrl}/faqs`;

    return [
        { title },
        { name: "description", content: description },
        { tagName: "link", rel: "canonical", href: pageUrl },
        { property: "og:title", content: title },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
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

export default function FAQs() {
    const { publicSettings } = usePublicSettings();
    const faqs = publicSettings?.faqs;
    const contactEmail =
        publicSettings?.contactUs?.email ||
        publicSettings?.general?.adminEmail ||
        "N/A";

    return (
        <Box sx={{ display: "grid", gap: 2.5, maxWidth: 980 }}>
            <Paper
                elevation={0}
                sx={{ p: { xs: 2, md: 3 }, border: "1px solid #e5e7eb" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.2rem", md: "1.75rem" } }}>
                    {faqs?.name || "FAQs"}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}>
                    {faqs?.summary ||
                        "Find quick answers to common platform questions."}
                </Typography>
            </Paper>

            <Box sx={{ display: "grid", gap: 1.2 }}>
                {(faqs?.questions || []).map((item, index) => (
                    <Accordion key={`${item.question}-${index}`} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 700 }}>
                                {item.question || `Question ${index + 1}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">
                                {item.answer || "N/A"}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
                {!faqs?.questions?.length && (
                    <Typography color="text.secondary">
                        No FAQs available yet.
                    </Typography>
                )}
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 2.5 },
                    border: "1px solid #dbeafe",
                    bgcolor: "#eff6ff",
                    display: "grid",
                    gap: 1.2,
                    mt: 5,
                }}>
                <Typography sx={{ fontWeight: 800 }}>
                    Still need help? Contact us at{" "}
                    <Box component="span" sx={{ color: "#1d4ed8" }}>
                        {contactEmail}
                    </Box>
                    .
                </Typography>
                <Box>
                    <Button
                        component={Link}
                        to="/contact-us"
                        variant="contained"
                        startIcon={<EmailOutlinedIcon />}
                        sx={{ textTransform: "none" }}>
                        Go to Contact Us
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
