import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Outlet } from "react-router";
import ScrollToTop from "~/components/custom/buttons/ScrollToTop";
import MainLayoutFooter from "~/components/custom/navigation/MainLayoutFooter";
import MainLayoutHeader from "~/components/custom/navigation/MainLayoutHeader";
import TopMarquee from "~/components/custom/navigation/TopMarquee";
import FloatingCard from "~/components/public/home/FloatingCard";

export default function MainLayout() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}>
            <Box>
                <TopMarquee />
                <MainLayoutHeader />

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
