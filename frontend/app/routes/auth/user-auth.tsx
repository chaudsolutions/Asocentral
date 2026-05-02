import { useForm, type SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FormPasswordField from "~/components/form-fields/FormPasswordField";
import FormTextField from "~/components/form-fields/FormTextField";
import { useAuthContext } from "~/context/AuthContext";
import { userLogin } from "~/hooks/useAuthApi";
import AppName from "~/components/custom/buttons/AppName";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";
import MainLayoutHeader from "~/components/custom/navigation/MainLayoutHeader";
import MainLayoutFooter from "~/components/custom/navigation/MainLayoutFooter";

interface LoginCredentials {
    email: string;
    password: string;
}

export default function UserAuth() {
    const { showToast } = useToast();
    const { login } = useAuthContext();

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginCredentials>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
        try {
            const response = await userLogin(data);
            login(response.token);
        } catch (err) {
            if (isAxiosError(err)) {
                showToast(
                    err.response?.data?.message || "Something went wrong",
                    "error",
                );
            } else {
                showToast("Something went wrong", "error");
            }
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb" }}>
            <MainLayoutHeader />
            <Box
                sx={{
                    minHeight: "calc(100vh - 180px)",
                    display: "flex",
                    alignItems: "center",
                    py: { xs: 5, md: 8 },
                }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1.1fr .9fr",
                            },
                            gap: { xs: 4, md: 6 },
                            alignItems: "center",
                        }}>
                        <Stack spacing={3}>
                            <Chip
                                label="Trojan News Contributor Access"
                                color="primary"
                                sx={{
                                    width: "fit-content",
                                    fontWeight: 800,
                                }}
                            />
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    color: "#003366",
                                    fontSize: {
                                        xs: "2.5rem",
                                        md: "4rem",
                                    },
                                    lineHeight: 1,
                                }}>
                                Report stories with clarity, speed, and trust.
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ maxWidth: 620 }}>
                                Sign in to submit stories for editorial review,
                                track publishing status, and keep your
                                journalist profile verified.
                            </Typography>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}>
                                {[
                                    "KYC verified publishing",
                                    "Editorial review queue",
                                    "Performance tracking",
                                ].map((item) => (
                                    <Paper
                                        key={item}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            border: "1px solid #e5e9f0",
                                            fontWeight: 700,
                                        }}>
                                        {item}
                                    </Paper>
                                ))}
                            </Stack>
                        </Stack>

                <Paper
                    elevation={4}
                    sx={{ p: 4, width: "100%", borderRadius: 2 }}>
                    <Box
                        sx={{
                            mb: 3,
                            bgcolor: "grey.900",
                            p: 1,
                            borderRadius: 2,
                            textAlign: "center",
                        }}>
                        <AppName />
                        <Typography
                            variant="h6"
                            sx={{
                                mt: 1,
                                fontWeight: 700,
                                color: "common.white",
                            }}>
                            Journalist Portal
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ display: "grid", gap: 2 }}>
                        <FormTextField
                            name="email"
                            label="Email"
                            control={control}
                            rules={{ required: "Email is required" }}
                        />

                        <FormPasswordField
                            name="password"
                            label="Password"
                            control={control}
                            rules={{ required: "Password is required" }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{ mt: 2, py: 1.2, bgcolor: "#003366" }}>
                            {isSubmitting ? "Signing in..." : "Login"}
                        </Button>
                    </Box>
                </Paper>
                    </Box>
                </Container>
            </Box>
            <MainLayoutFooter />
        </Box>
    );
}
