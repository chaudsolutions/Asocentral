import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HomeIcon from "@mui/icons-material/Home";
import type { Route } from "./+types/admin404";
import { fetchPublicSettings } from "~/hooks/useNewsDataApi";

export async function loader() {
    const settings = await fetchPublicSettings();
    return { settings };
}

export function meta({ loaderData }: Route.MetaArgs) {
    const appName = loaderData?.settings?.general?.websiteName || "N/A";
    const websiteLogo = loaderData?.settings?.general?.logoUrl || "";

    return [
        { title: `Admin 404 | ${appName}` },
        // Favicon
        { tagName: "link", rel: "icon", href: websiteLogo, sizes: "any" },
    ];
}

export default function Admin404() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 3,
                }}>
                <Box
                    sx={{
                        bgcolor: "grey.100",
                        p: 3,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <EngineeringIcon sx={{ fontSize: 80, color: "#003366" }} />
                </Box>

                <Box>
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 900, color: "#003366", mb: 1 }}>
                        404
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        Under Construction or Missing
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}>
                        The page you are looking for is either currently being
                        worked on by our development team or the link has been
                        moved.
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate("/admin/dashboard")}
                        sx={{
                            bgcolor: "#003366",
                            px: 4,
                            py: 1.2,
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#002244" },
                        }}>
                        Back to Dashboard
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        sx={{
                            px: 4,
                            fontWeight: 700,
                            borderColor: "#003366",
                            color: "#003366",
                        }}>
                        Go Back
                    </Button>
                </Box>

                <Typography
                    variant="caption"
                    sx={{ mt: 4, color: "text.disabled" }}>
                    N/A Admin Portal • Version 1.2.0
                </Typography>
            </Box>
        </Container>
    );
}
