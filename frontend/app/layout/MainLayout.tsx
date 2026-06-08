import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Outlet } from "react-router";
import ScrollToTop from "~/components/custom/buttons/ScrollToTop";
import MainLayoutFooter from "~/components/custom/navigation/MainLayoutFooter";
import MainLayoutHeader from "~/components/custom/navigation/MainLayoutHeader";
import FloatingCard from "~/components/public/home/FloatingCard";

export default function MainLayout() {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.getElementById("main-layout-header");
        if (!header) return;
        setHeaderHeight(header.offsetHeight);
        const ro = new ResizeObserver(() => setHeaderHeight(header.offsetHeight));
        ro.observe(header);
        return () => ro.disconnect();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}>
            <MainLayoutHeader />

            <Box sx={{ flex: 1, pt: `${headerHeight}px` }}>
                <Container maxWidth="xl">
                    <Box sx={{ my: 4 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 9 }}>
                                <Outlet />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FloatingCard />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

            <MainLayoutFooter />
            <ScrollToTop />
        </Box>
    );
}
