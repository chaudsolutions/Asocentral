import { useForm, type SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import FormPasswordField from "~/components/form-fields/FormPasswordField";
import FormTextField from "~/components/form-fields/FormTextField";
import { useAuthContext } from "~/context/AuthContext";
import { adminLogin } from "~/hooks/useAuthApi";
import AppName from "~/components/custom/buttons/AppName";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

interface AdminLoginCredentials {
    email: string;
    password: string;
}

export default function AdminAuth() {
    const { showToast } = useToast();
    const { login } = useAuthContext();

    // Initialize React Hook Form
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<AdminLoginCredentials>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<AdminLoginCredentials> = async (data) => {
        try {
            const response = await adminLogin(data);

            // Update AuthContext with user/token
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
        <Container maxWidth="xs">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        width: "100%",
                        borderRadius: 2,
                        textAlign: "center",
                    }}>
                    <Box
                        sx={{
                            mb: 3,
                            bgcolor: "grey.900",
                            p: 1,
                            borderRadius: 2,
                        }}>
                        <AppName />
                        <Typography
                            variant="h6"
                            sx={{
                                mt: 1,
                                fontWeight: 700,
                                color: "common.white",
                            }}>
                            Admin Portal
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ display: "grid", gap: 2 }}>
                        <FormTextField
                            name="email"
                            label="Admin Email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            }}
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
                            sx={{
                                mt: 2,
                                py: 1.2,
                                bgcolor: "#003366", // Matching your brand navy
                                fontWeight: 700,
                                "&:hover": {
                                    bgcolor: "#002244",
                                },
                            }}>
                            {isSubmitting
                                ? "Authenticating..."
                                : "Login to Dashboard"}
                        </Button>
                    </Box>
                </Paper>

                <Typography
                    variant="caption"
                    sx={{ mt: 3, color: "text.disabled" }}>
                    © 2026 Trojan News Network • Secure Access Only
                </Typography>
            </Box>
        </Container>
    );
}
