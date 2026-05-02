import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormTextField from "~/components/form-fields/FormTextField";
import FormPasswordField from "~/components/form-fields/FormPasswordField";
import FormImageSelectUpload from "~/components/form-fields/FormImageSelectUpload";
import FormAutocomplete from "~/components/form-fields/FormAutocomplete";
import { appName } from "~/utils/constants";
import { useUserData } from "~/hooks/useCaching";
import {
    changeMyPassword,
    updateMyKyc,
    updateMyProfile,
    type KycPayload,
} from "~/hooks/useUserApi";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";
import { countriesStatesArray } from "~/utils/countries-states";

export function meta() {
    return [{ title: `Journalist Settings | ${appName}` }];
}

function TabPanel({
    children,
    value,
    index,
}: {
    children: React.ReactNode;
    value: number;
    index: number;
}) {
    return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

interface ProfileForm {
    name: string;
    email: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
}

export default function UserSettings() {
    const [tab, setTab] = useState(0);
    const { showToast } = useToast();
    const { userData, refetchUserData } = useUserData();

    const profileForm = useForm<ProfileForm>({
        defaultValues: { name: "", email: "" },
    });
    const kycForm = useForm<KycPayload>({
        defaultValues: {
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            state: "",
            country: "",
            occupation: "",
            age: 18,
            zip: "",
            idCardImage: "",
        },
    });
    const passwordForm = useForm<PasswordForm>({
        defaultValues: { currentPassword: "", newPassword: "" },
    });
    const selectedCountry = kycForm.watch("country");
    const countries = useMemo(
        () => countriesStatesArray.map((country) => country.name),
        [],
    );
    const states = useMemo(() => {
        const country = countriesStatesArray.find(
            (item) => item.name === selectedCountry,
        );
        return country?.states.map((state) => state.name) || [];
    }, [selectedCountry]);

    useEffect(() => {
        if (userData) {
            profileForm.reset({
                name: userData.name,
                email: userData.email,
            });
            kycForm.reset({
                firstName: userData.kycDetails?.firstName || "",
                lastName: userData.kycDetails?.lastName || "",
                address: userData.kycDetails?.address || "",
                city: userData.kycDetails?.city || "",
                state: userData.kycDetails?.state || "",
                country: userData.kycDetails?.country || "",
                occupation: userData.kycDetails?.occupation || "",
                age: userData.kycDetails?.age || 18,
                zip: userData.kycDetails?.zip || "",
                idCardImage: userData.kycDetails?.idCardImage || "",
            });
        }
    }, [userData]);

    const handleError = (error: unknown) => {
        if (isAxiosError(error)) {
            showToast(
                error.response?.data?.message || "Something went wrong",
                "error",
            );
        } else {
            showToast("Something went wrong", "error");
        }
    };

    const onProfileSubmit: SubmitHandler<ProfileForm> = async (data) => {
        try {
            const res = await updateMyProfile(data);
            showToast(res.message, "success");
            refetchUserData();
        } catch (error) {
            handleError(error);
        }
    };

    const onKycSubmit: SubmitHandler<KycPayload> = async (data) => {
        try {
            const res = await updateMyKyc({ ...data, age: Number(data.age) });
            showToast(res.message, "success");
            refetchUserData();
        } catch (error) {
            handleError(error);
        }
    };

    const onPasswordSubmit: SubmitHandler<PasswordForm> = async (data) => {
        try {
            const res = await changeMyPassword(data);
            showToast(res.message, "success");
            passwordForm.reset();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Keep your journalist profile verified and secure.
            </Typography>

            <Paper elevation={0} sx={{ mt: 3, p: 3, border: "1px solid #eee" }}>
                <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                    <Tab label="KYC" />
                    <Tab label="User Information" />
                    <Tab label="Security" />
                </Tabs>

                <TabPanel value={tab} index={0}>
                    <Box
                        component="form"
                        onSubmit={kycForm.handleSubmit(onKycSubmit)}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormTextField
                                    name="firstName"
                                    label="First Name"
                                    control={kycForm.control}
                                    rules={{ required: "First name is required" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormTextField
                                    name="lastName"
                                    label="Last Name"
                                    control={kycForm.control}
                                    rules={{ required: "Last name is required" }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormTextField
                                    name="address"
                                    label="Address"
                                    control={kycForm.control}
                                    rules={{ required: "Address is required" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormAutocomplete<KycPayload, string>
                                    name="country"
                                    label="Country"
                                    control={kycForm.control}
                                    options={countries}
                                    getOptionLabel={(option) => option}
                                    isEqual={(option, value) =>
                                        option === value
                                    }
                                    rules={{ required: "Country is required" }}
                                    placeholder="Select country"
                                    onChange={() => {
                                        kycForm.setValue("state", "");
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormAutocomplete<KycPayload, string>
                                    name="state"
                                    label="State"
                                    control={kycForm.control}
                                    options={states}
                                    getOptionLabel={(option) => option}
                                    isEqual={(option, value) =>
                                        option === value
                                    }
                                    disabled={!selectedCountry}
                                    rules={{ required: "State is required" }}
                                    placeholder={
                                        selectedCountry
                                            ? "Select state"
                                            : "Select a country first"
                                    }
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormTextField
                                    name="city"
                                    label="City"
                                    control={kycForm.control}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormTextField
                                    name="occupation"
                                    label="Occupation"
                                    control={kycForm.control}
                                    rules={{
                                        required: "Occupation is required",
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormTextField
                                    name="age"
                                    label="Age"
                                    type="number"
                                    control={kycForm.control}
                                    rules={{ required: "Age is required" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormTextField
                                    name="zip"
                                    label="Zip / Postal Code"
                                    control={kycForm.control}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormImageSelectUpload
                                    name="idCardImage"
                                    label="Upload ID Card"
                                    control={kycForm.control}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            loading={kycForm.formState.isSubmitting}
                            sx={{ mt: 3, bgcolor: "#003366" }}>
                            Save KYC
                        </Button>
                    </Box>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <Box
                        component="form"
                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                        sx={{ display: "grid", gap: 3, maxWidth: 520 }}>
                        <FormTextField
                            name="name"
                            label="Name"
                            control={profileForm.control}
                            rules={{ required: "Name is required" }}
                        />
                        <FormTextField
                            name="email"
                            label="Email"
                            type="email"
                            control={profileForm.control}
                            rules={{ required: "Email is required" }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            loading={profileForm.formState.isSubmitting}
                            sx={{ bgcolor: "#003366", width: "fit-content" }}>
                            Save Profile
                        </Button>
                    </Box>
                </TabPanel>

                <TabPanel value={tab} index={2}>
                    <Box
                        component="form"
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                        sx={{ display: "grid", gap: 3, maxWidth: 520 }}>
                        <FormPasswordField
                            name="currentPassword"
                            label="Current Password"
                            control={passwordForm.control}
                            rules={{
                                required: "Current password is required",
                            }}
                        />
                        <FormPasswordField
                            name="newPassword"
                            label="New Password"
                            control={passwordForm.control}
                            rules={{
                                required: "New password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            loading={passwordForm.formState.isSubmitting}
                            sx={{ bgcolor: "#003366", width: "fit-content" }}>
                            Change Password
                        </Button>
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
}
