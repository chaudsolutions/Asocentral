import {
    isRouteErrorResponse,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    Link,
} from "react-router";

import type { Route } from "./+types/root";
import appStylesHref from "./app.css?url";
import { AppProviders } from "./providers/appProviders";
import { appName as APP_NAME } from "./utils/constants";
import NavigationProgress from "./components/animations/NavigationProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="google-site-verification"
                    content="77f8oSN-tlXbBSqTrjvv7JMs59dtuxH6OxDmaNPbT5w"
                />
                <Meta />
                <link rel="stylesheet" href={appStylesHref} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
                />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <AppProviders>
            <NavigationProgress />
            <Outlet />
        </AppProviders>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;
    let is404 = false;

    if (isRouteErrorResponse(error)) {
        is404 = error.status === 404;
        message = is404 ? "404" : String(error.status);
        details = is404
            ? "The page you're looking for doesn't exist."
            : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
                display: "flex",
                flexDirection: "column",
            }}>
            {/* Header bar */}
            <Box sx={{ bgcolor: "#003366", py: 1.5, px: { xs: 2, md: 4 } }}>
                <Typography
                    component={Link}
                    to="/"
                    sx={{
                        color: "white",
                        fontWeight: 900,
                        fontSize: { xs: "1rem", md: "1.3rem" },
                        textDecoration: "none",
                        fontFamily: "Arial Narrow, sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}>
                    {APP_NAME}
                </Typography>
            </Box>

            {/* Error content */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 3,
                    py: 8,
                    textAlign: "center",
                }}>
                {/* Big status code */}
                <Typography
                    sx={{
                        fontSize: { xs: "5rem", md: "9rem" },
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "#c00",
                        fontFamily: "Arial Narrow, sans-serif",
                        mb: 1,
                    }}>
                    {message}
                </Typography>

                {/* Divider accent */}
                <Box
                    sx={{
                        width: 60,
                        height: 4,
                        bgcolor: "#003366",
                        borderRadius: 2,
                        mb: 3,
                    }}
                />

                <Typography
                    sx={{
                        fontSize: { xs: "1rem", md: "1.25rem" },
                        color: "#333",
                        fontWeight: 600,
                        mb: 1,
                    }}>
                    {is404 ? "Page Not Found" : "Something went wrong"}
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        color: "#777",
                        maxWidth: 480,
                        mb: 4,
                        lineHeight: 1.7,
                    }}>
                    {details}
                </Typography>

                {/* Action buttons */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        startIcon={<HomeIcon />}
                        sx={{
                            bgcolor: "#003366",
                            fontWeight: 700,
                            px: 3,
                            "&:hover": { bgcolor: "#002244" },
                        }}>
                        Go Home
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => window.location.reload()}
                        sx={{
                            borderColor: "#003366",
                            color: "#003366",
                            fontWeight: 700,
                            px: 3,
                            "&:hover": {
                                borderColor: "#002244",
                                bgcolor: "rgba(0,51,102,0.05)",
                            },
                        }}>
                        Reload Page
                    </Button>
                </Box>

                {/* Dev stack trace */}
                {stack && (
                    <Box
                        component="pre"
                        sx={{
                            mt: 5,
                            p: 3,
                            bgcolor: "#1a1a2e",
                            color: "#e0e0e0",
                            borderRadius: 2,
                            overflowX: "auto",
                            fontSize: "0.75rem",
                            textAlign: "left",
                            maxWidth: "100%",
                            width: "100%",
                            maxHeight: 300,
                            overflowY: "auto",
                        }}>
                        <code>{stack}</code>
                    </Box>
                )}
            </Box>

            {/* Footer strip */}
            <Box
                sx={{
                    bgcolor: "#001a33",
                    py: 2,
                    textAlign: "center",
                }}>
                <Typography
                    sx={{
                        color: "#666",
                        fontSize: "0.75rem",
                    }}>
                    © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
