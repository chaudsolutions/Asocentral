import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import XIcon from "@mui/icons-material/X";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormTextField from "~/components/form-fields/FormTextField";
import { sendContactMessage } from "~/hooks/useNewsDataApi";
import { usePublicSettings } from "~/hooks/useCaching";
import { useToast } from "~/context/ToastContext";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";
import type { Route } from "./+types/contact-us";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteUrl = loaderData?.settings?.general?.websiteUrl || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";
    const title = `Contact Us | ${appName}`;
    const description =
        "Contact Trojan News for editorial feedback, corrections, partnerships, and newsroom support.";
    const pageUrl = `${websiteUrl}/contact-us`;

    return [
        { title },
        { name: "description", content: description },
        {
            name: "keywords",
            content:
                "contact trojan news, newsroom contact, editorial support, press inquiry",
        },
        { name: "robots", content: "index, follow" },
        { tagName: "link", rel: "canonical", href: pageUrl },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
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

export default function ContactUs() {
    const { showToast } = useToast();
    const { publicSettings, isPublicSettingsLoading } = usePublicSettings();
    const socialLinks = publicSettings?.general?.socialLinks;
    const address =
        publicSettings?.general?.address ||
        publicSettings?.contactUs?.address ||
        "";
    const mapSrc = address
        ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
        : "";
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<{
        name: string;
        email: string;
        subject: string;
        message: string;
    }>({
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const submit = async (payload: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }) => {
        setLoading(true);
        try {
            const res = await sendContactMessage(payload);
            showToast(res.message, "success");
            reset();
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message || "Failed to send message",
                    "error",
                );
            } else {
                showToast("Failed to send message", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (isPublicSettingsLoading && !publicSettings) {
        return (
            <Box sx={{ display: "grid", gap: 2 }}>
                <Skeleton variant="rounded" height={120} />
                <Skeleton variant="rounded" height={300} />
                <Skeleton variant="rounded" height={280} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "grid", gap: 2.5 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 3 },
                    border: "1px solid #dbeafe",
                    bgcolor: "#eff6ff",
                }}>
                <Chip
                    label="Support & Inquiries"
                    size="small"
                    sx={{
                        mb: 1.2,
                        width: "fit-content",
                        bgcolor: "#dbeafe",
                        color: "#1e3a8a",
                        fontWeight: 700,
                    }}
                />
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                    {publicSettings?.contactUs?.title || "Contact Us"}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 800 }}>
                    {publicSettings?.contactUs?.description ||
                        "Reach our newsroom and support team for assistance, corrections, and partnerships."}
                </Typography>
            </Paper>

            {mapSrc && (
                <Paper
                    elevation={0}
                    sx={{
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        height: { xs: 260, md: 340 },
                        borderRadius: 1,
                    }}>
                    <Box
                        component="iframe"
                        src={mapSrc}
                        sx={{
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location Map"
                    />
                </Paper>
            )}

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Stack spacing={2}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #bfdbfe",
                                bgcolor: "#f8fbff",
                            }}>
                            <Stack spacing={1.2}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center" }}>
                                    <EmailOutlinedIcon fontSize="small" />
                                    <Typography sx={{ fontWeight: 700 }}>
                                        Email
                                    </Typography>
                                </Stack>
                                <Typography color="text.secondary">
                                    {publicSettings?.contactUs?.email ||
                                        publicSettings?.general?.adminEmail ||
                                        "Not available"}
                                </Typography>
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #c7d2fe",
                                bgcolor: "#f8faff",
                            }}>
                            <Stack spacing={1.2}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center" }}>
                                    <PhoneOutlinedIcon fontSize="small" />
                                    <Typography sx={{ fontWeight: 700 }}>
                                        Phone
                                    </Typography>
                                </Stack>
                                <Typography color="text.secondary">
                                    {publicSettings?.contactUs?.phone ||
                                        "Not available"}
                                </Typography>
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #fde68a",
                                bgcolor: "#fffbeb",
                            }}>
                            <Stack spacing={1.2}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ alignItems: "center" }}>
                                    <PlaceOutlinedIcon fontSize="small" />
                                    <Typography sx={{ fontWeight: 700 }}>
                                        Address
                                    </Typography>
                                </Stack>
                                <Typography color="text.secondary">
                                    {address || "Not available"}
                                </Typography>
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #fbcfe8",
                                bgcolor: "#fdf2f8",
                            }}>
                            <Typography sx={{ fontWeight: 700, mb: 1.2 }}>
                                Social Media
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <SocialIcon
                                    href={socialLinks?.twitter}
                                    icon={<XIcon fontSize="small" />}
                                />
                                <SocialIcon
                                    href={socialLinks?.facebook}
                                    icon={
                                        <FacebookOutlinedIcon fontSize="small" />
                                    }
                                />
                                <SocialIcon
                                    href={socialLinks?.instagram}
                                    icon={<InstagramIcon fontSize="small" />}
                                />
                                <SocialIcon
                                    href={socialLinks?.linkedin}
                                    icon={<LinkedInIcon fontSize="small" />}
                                />
                                <SocialIcon
                                    href={socialLinks?.youtube}
                                    icon={<YouTubeIcon fontSize="small" />}
                                />
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            border: "1px solid #ddd6fe",
                        }}>
                        <Stack
                            spacing={2}
                            component="form"
                            onSubmit={handleSubmit(submit)}>
                            <FormTextField
                                name="name"
                                label="Name"
                                control={control}
                                fullWidth
                                rules={{ required: "Name is required" }}
                            />
                            <FormTextField
                                name="email"
                                label="Email"
                                control={control}
                                fullWidth
                                rules={{ required: "Email is required" }}
                            />
                            <FormTextField
                                name="subject"
                                label="Subject"
                                control={control}
                                fullWidth
                                rules={{ required: "Subject is required" }}
                            />
                            <FormTextArea
                                name="message"
                                label="Message"
                                control={control}
                                rows={5}
                                rules={{ required: "Message is required" }}
                            />
                            <Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        bgcolor: "#4f46e5",
                                        "&:hover": { bgcolor: "#4338ca" },
                                    }}>
                                    Send Message
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

function SocialIcon({ href, icon }: { href?: string; icon: ReactNode }) {
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
