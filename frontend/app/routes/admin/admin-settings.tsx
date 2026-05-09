import { useEffect, useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { isAxiosError } from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormTextField from "~/components/form-fields/FormTextField";
import FormImageSelectUpload from "~/components/form-fields/FormImageSelectUpload";
import { useAdminSettings } from "~/hooks/useCaching";
import { changeAdminPassword, updateAdminSettings } from "~/hooks/useUserApi";
import { useToast } from "~/context/ToastContext";
import type { AppSettingsType } from "~/types/settings";
import { uploadIfNeeded } from "~/hooks/useUpload";

export function meta() {
    return [{ title: "Admin Settings | N/A" }];
}

type SettingsDraft = Omit<AppSettingsType, "_id" | "key">;

const defaultDraft: SettingsDraft = {
    general: {
        websiteName: "",
        logoUrl: "",
        websiteUrl: "",
        websiteDescription: "",
        adminEmail: "",
        marqueeText: "",
        address: "",
        socialLinks: {
            twitter: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
        },
    },
    aboutUs: {
        title: "",
        summary: "",
        sections: [],
    },
    contactUs: {
        title: "",
        description: "",
        email: "",
        phone: "",
        address: "",
    },
    faqs: {
        name: "FAQs",
        summary: "",
        questions: [],
    },
    security: {
        lockPassword: "12345",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
    },
};

export default function AdminSettings() {
    const { showToast } = useToast();
    const { adminSettings, isAdminSettingsLoading, refetchAdminSettings } =
        useAdminSettings();
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSecurityUnlocked, setIsSecurityUnlocked] = useState(false);
    const [securityPasswordInput, setSecurityPasswordInput] = useState("");
    const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const { control, reset, getValues } = useForm<SettingsDraft>({
        defaultValues: defaultDraft,
    });
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        watch: watchPassword,
        reset: resetPasswordForm,
    } = useForm<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "aboutUs.sections",
    });
    const {
        fields: faqFields,
        append: appendFaq,
        remove: removeFaq,
    } = useFieldArray({
        control,
        name: "faqs.questions",
    });

    useEffect(() => {
        if (adminSettings) {
            reset({
                general: adminSettings.general,
                aboutUs: adminSettings.aboutUs,
                contactUs: adminSettings.contactUs,
                faqs: adminSettings.faqs || defaultDraft.faqs,
                security: adminSettings.security || defaultDraft.security,
            });
        }
    }, [adminSettings, reset]);

    const save = async () => {
        setLoading(true);
        try {
            const draft = getValues();
            const uploadedLogo =
                tab === 0
                    ? await uploadIfNeeded(draft.general.logoUrl, {
                          folder: "branding",
                          fileName: `${draft.general.websiteName || "platform"}-logo`,
                      })
                    : draft.general.logoUrl;
            const aboutSectionsWithUploadedImages =
                tab === 1
                    ? await Promise.all(
                          (draft.aboutUs.sections || []).map(
                              async (section, index) => ({
                                  ...section,
                                  image: await uploadIfNeeded(section.image, {
                                      folder: "about-us",
                                      fileName: `${draft.aboutUs.title || "about"}-section-${index + 1}`,
                                  }),
                              }),
                          ),
                      )
                    : draft.aboutUs.sections;

            const payload =
                tab === 0
                    ? {
                          general: {
                              ...draft.general,
                              logoUrl: uploadedLogo,
                          },
                      }
                    : tab === 1
                      ? {
                            aboutUs: {
                                ...draft.aboutUs,
                                sections: aboutSectionsWithUploadedImages,
                            },
                        }
                      : tab === 2
                        ? { contactUs: draft.contactUs }
                      : tab === 3
                        ? { faqs: draft.faqs }
                        : { security: draft.security };
            const res = await updateAdminSettings(payload);
            showToast(res.message, "success");
            refetchAdminSettings();
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message ||
                        "Failed to update settings",
                    "error",
                );
            } else {
                showToast("Failed to update settings", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_: SyntheticEvent, value: number) => {
        if (value === 4 && !isSecurityUnlocked) {
            setTab(4);
            setIsUnlockDialogOpen(true);
            return;
        }
        setTab(value);
    };

    const closeUnlockDialog = () => {
        setIsUnlockDialogOpen(false);
        setSecurityPasswordInput("");
        if (!isSecurityUnlocked) {
            setTab(0);
        }
    };

    const onAdminPasswordSubmit = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (values.newPassword !== values.confirmPassword) {
            showToast(
                "New password and confirm password do not match",
                "error",
            );
            return;
        }
        setPasswordLoading(true);
        try {
            const res = await changeAdminPassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            showToast(res.message, "success");
            resetPasswordForm();
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message ||
                        "Failed to change password",
                    "error",
                );
            } else {
                showToast("Failed to change password", "error");
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    if (isAdminSettingsLoading) {
        return <Typography>Loading settings...</Typography>;
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                App Settings
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    variant="scrollable">
                    <Tab label="General" />
                    <Tab label="About Us" />
                    <Tab label="Contact Us" />
                    <Tab label="FAQs" />
                    <Tab label="Security" />
                </Tabs>
            </Paper>

            <Paper sx={{ p: 2 }}>
                {tab === 0 && (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormImageSelectUpload
                                name="general.logoUrl"
                                label="Upload Platform Logo"
                                control={control}
                                maxSize={5 * 1024 * 1024}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.websiteName"
                                label="Website Name"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.adminEmail"
                                label="Admin Email"
                                control={control}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormTextArea
                                name="general.websiteDescription"
                                label="Website Description"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextArea
                                name="general.marqueeText"
                                label="Top Marquee Text"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextArea
                                name="general.address"
                                label="Office Address"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.websiteUrl"
                                label="Website URL"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.socialLinks.twitter"
                                label="Twitter/X Link"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.socialLinks.facebook"
                                label="Facebook Link"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.socialLinks.instagram"
                                label="Instagram Link"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.socialLinks.linkedin"
                                label="LinkedIn Link"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="general.socialLinks.youtube"
                                label="YouTube Link"
                                control={control}
                            />
                        </Grid>
                    </Grid>
                )}

                {tab === 1 && (
                    <Stack spacing={2}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <FormTextField
                                    name="aboutUs.title"
                                    label="Title"
                                    control={control}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormTextArea
                                    name="aboutUs.summary"
                                    label="Summary"
                                    control={control}
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                        <Typography sx={{ fontWeight: 700, mt: 1 }}>
                            About Sections
                        </Typography>
                        {fields.map((field, index) => (
                            <Paper
                                key={field.id}
                                variant="outlined"
                                sx={{ p: 2, bgcolor: "#fafafa" }}>
                                <Stack spacing={1.5}>
                                    <Stack
                                        direction="row"
                                        sx={{
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            Section #{index + 1}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => remove(index)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <FormImageSelectUpload
                                                name={`aboutUs.sections.${index}.image`}
                                                label="Section Image (Optional)"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <FormTextField
                                                name={`aboutUs.sections.${index}.title`}
                                                label="Section Title (Optional)"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <FormTextArea
                                                name={`aboutUs.sections.${index}.description`}
                                                label="Section Description"
                                                control={control}
                                                rows={4}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Paper>
                        ))}
                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    append({
                                        title: "",
                                        image: "",
                                        description: "",
                                    })
                                }>
                                Add Section
                            </Button>
                        </Box>
                    </Stack>
                )}

                {tab === 2 && (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormTextField
                                name="contactUs.title"
                                label="Title"
                                control={control}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormTextArea
                                name="contactUs.description"
                                label="Description"
                                control={control}
                                rows={4}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="contactUs.email"
                                label="Contact Email"
                                control={control}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormTextField
                                name="contactUs.phone"
                                label="Phone"
                                control={control}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormTextField
                                name="contactUs.address"
                                label="Address"
                                control={control}
                            />
                        </Grid>
                    </Grid>
                )}

                {tab === 3 && (
                    <Stack spacing={2}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <FormTextField
                                    name="faqs.name"
                                    label="FAQs Name"
                                    control={control}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormTextArea
                                    name="faqs.summary"
                                    label="FAQs Summary"
                                    control={control}
                                    rows={3}
                                />
                            </Grid>
                        </Grid>

                        {faqFields.map((field, index) => (
                            <Paper
                                key={field.id}
                                variant="outlined"
                                sx={{ p: 2, bgcolor: "#fafafa" }}>
                                <Stack spacing={1.5}>
                                    <Stack
                                        direction="row"
                                        sx={{
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            FAQ #{index + 1}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeFaq(index)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <FormTextField
                                                name={`faqs.questions.${index}.question`}
                                                label="Question"
                                                control={control}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <FormTextArea
                                                name={`faqs.questions.${index}.answer`}
                                                label="Answer"
                                                control={control}
                                                rows={4}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Paper>
                        ))}

                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    appendFaq({ question: "", answer: "" })
                                }>
                                Add FAQ
                            </Button>
                        </Box>
                    </Stack>
                )}

                {tab === 4 && (
                    <Stack spacing={2}>
                        {isSecurityUnlocked ? (
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormTextField
                                        name="security.lockPassword"
                                        label="Lock Password"
                                        control={control}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormTextField
                                        name="security.smtpHost"
                                        label="SMTP Host"
                                        control={control}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormTextField
                                        name="security.smtpPort"
                                        label="SMTP Port"
                                        control={control}
                                        type="number"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormTextField
                                        name="security.smtpUser"
                                        label="Nodemailer SMTP User"
                                        control={control}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormTextField
                                        name="security.smtpPass"
                                        label="Nodemailer SMTP Password"
                                        control={control}
                                        type="password"
                                    />
                                </Grid>
                            </Grid>
                        ) : null}

                        {isSecurityUnlocked ? (
                            <>
                                <Divider sx={{ my: 1.5 }} />
                                <Box
                                    component="form"
                                    onSubmit={handlePasswordSubmit(
                                        onAdminPasswordSubmit,
                                    )}>
                                    <Typography
                                        sx={{ fontWeight: 700, mb: 1.5 }}>
                                        Change Admin Password
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormTextField
                                                name="currentPassword"
                                                label="Old Password"
                                                control={passwordControl}
                                                type="password"
                                                rules={{
                                                    required:
                                                        "Old password is required",
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormTextField
                                                name="newPassword"
                                                label="New Password"
                                                control={passwordControl}
                                                type="password"
                                                rules={{
                                                    required:
                                                        "New password is required",
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormTextField
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                control={passwordControl}
                                                type="password"
                                                rules={{
                                                    required:
                                                        "Please confirm password",
                                                    validate: (value: string) =>
                                                        value ===
                                                            watchPassword(
                                                                "newPassword",
                                                            ) ||
                                                        "Passwords do not match",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        sx={{ mt: 1.5 }}
                                        disabled={passwordLoading}>
                                        Update Admin Password
                                    </Button>
                                </Box>
                            </>
                        ) : null}
                    </Stack>
                )}

                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={save}
                        disabled={loading}>
                        Save Settings
                    </Button>
                </Box>
            </Paper>
            <Dialog
                open={isUnlockDialogOpen}
                onClose={closeUnlockDialog}
                fullWidth
                maxWidth="xs">
                <DialogTitle>Unlock Security Settings</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter Security Password"
                        type="password"
                        fullWidth
                        size="small"
                        value={securityPasswordInput}
                        onChange={(e) =>
                            setSecurityPasswordInput(e.target.value)
                        }
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUnlockDialog}>Close</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            const lockPassword =
                                getValues().security?.lockPassword || "12345";
                            if (securityPasswordInput === lockPassword) {
                                setIsSecurityUnlocked(true);
                                setIsUnlockDialogOpen(false);
                                setSecurityPasswordInput("");
                            } else {
                                showToast("Invalid security password", "error");
                            }
                        }}>
                        Unlock
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
