import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { isAxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import FormTextField from "~/components/form-fields/FormTextField";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormImageSelectUpload from "~/components/form-fields/FormImageSelectUpload";
import { uploadIfNeeded } from "~/hooks/useUpload";
import {
    createPersonality,
    deletePersonality,
    updatePersonality,
} from "~/hooks/useUserApi";
import { useAdminPersonalities } from "~/hooks/useCaching";
import { useToast } from "~/context/ToastContext";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import type { PersonalityType } from "~/types/personality";

export function meta() {
    return [{ title: "Admin Personality | N/A" }];
}

function CustomTabPanel({
    children,
    value,
    index,
}: {
    children?: React.ReactNode;
    value: number;
    index: number;
}) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index ? <Box sx={{ p: { xs: 1, md: 2 } }}>{children}</Box> : null}
        </div>
    );
}

export default function AdminPersonality() {
    const { showToast } = useToast();
    const { confirm } = useConfirmDialog();
    const {
        adminPersonalities = [],
        isAdminPersonalitiesLoading,
        refetchAdminPersonalities,
    } = useAdminPersonalities();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [editingPersonality, setEditingPersonality] =
        useState<PersonalityType | null>(null);

    const { control, handleSubmit, reset } = useForm<{
        title: string;
        description: string;
        image: string | null;
        website: string;
        twitter: string;
        facebook: string;
        instagram: string;
        linkedin: string;
        youtube: string;
        isActive: boolean;
    }>({
        defaultValues: {
            title: "",
            description: "",
            image: null,
            website: "",
            twitter: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            isActive: true,
        },
    });

    const handleCreate = () => {
        setEditingPersonality(null);
        reset({
            title: "",
            description: "",
            image: null,
            website: "",
            twitter: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            isActive: true,
        });
        setTabValue(1);
    };

    const handleEdit = (personality: PersonalityType) => {
        setEditingPersonality(personality);
        reset({
            title: personality.title,
            description: personality.description,
            image: personality.image,
            website: personality.website || "",
            twitter: personality.socialLinks?.twitter || "",
            facebook: personality.socialLinks?.facebook || "",
            instagram: personality.socialLinks?.instagram || "",
            linkedin: personality.socialLinks?.linkedin || "",
            youtube: personality.socialLinks?.youtube || "",
            isActive: personality.isActive,
        });
        setTabValue(1);
    };

    const handleDelete = async (personality: PersonalityType) => {
        await confirm({
            title: `Delete ${personality.title}`,
            message: "Are you sure you want to delete this personality?",
            confirmText: "Delete",
            confirmColor: "error",
            onConfirm: async () => {
                try {
                    const res = await deletePersonality(personality._id);
                    showToast(res.message, "success");
                    refetchAdminPersonalities();
                } catch (error) {
                    if (isAxiosError(error)) {
                        showToast(
                            error.response?.data?.message ||
                                "Unable to delete personality",
                            "error",
                        );
                    } else {
                        showToast("Unable to delete personality", "error");
                    }
                }
            },
        });
    };

    const submit = async (data: {
        title: string;
        description: string;
        image: string | null;
        website: string;
        twitter: string;
        facebook: string;
        instagram: string;
        linkedin: string;
        youtube: string;
        isActive: boolean;
    }) => {
        setLoading(true);
        try {
            const uploadedImage = await uploadIfNeeded(data.image, {
                folder: "personality",
                fileName: `${data.title || "personality"}-image`,
            });

            if (!uploadedImage) {
                showToast("Please upload an image", "error");
                setLoading(false);
                return;
            }

            const payload = {
                title: data.title,
                description: data.description,
                image: uploadedImage,
                website: data.website,
                socialLinks: {
                    twitter: data.twitter,
                    facebook: data.facebook,
                    instagram: data.instagram,
                    linkedin: data.linkedin,
                    youtube: data.youtube,
                },
                isActive: data.isActive,
            };

            const res = editingPersonality
                ? await updatePersonality(editingPersonality._id, payload)
                : await createPersonality(payload);

            showToast(res.message, "success");
            refetchAdminPersonalities();
            setEditingPersonality(null);
            reset({
                title: "",
                description: "",
                image: null,
                website: "",
                twitter: "",
                facebook: "",
                instagram: "",
                linkedin: "",
                youtube: "",
                isActive: true,
            });
            setTabValue(0);
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message ||
                        "Unable to save personality",
                    "error",
                );
            } else {
                showToast("Unable to save personality", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomTabPanel value={tabValue} index={0}>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Personality of the Week
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}>
                        Create Personality
                    </Button>
                </Stack>

                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminPersonalities.map((item) => (
                                <TableRow key={item._id} hover>
                                    <TableCell>
                                        <Box
                                            component="img"
                                            src={item.image}
                                            alt={item.title}
                                            sx={{
                                                width: 64,
                                                height: 44,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={item.isActive ? "Active" : "Inactive"}
                                            color={item.isActive ? "success" : "default"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(item)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(item)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isAdminPersonalitiesLoading &&
                                adminPersonalities.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography
                                                variant="body2"
                                                sx={{ py: 3, textAlign: "center" }}>
                                                No personalities yet.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <Paper sx={{ p: 2 }}>
                    <Stack
                        spacing={2}
                        component="form"
                        onSubmit={handleSubmit(submit)}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            {editingPersonality
                                ? "Edit Personality"
                                : "Create Personality"}
                        </Typography>
                        <FormTextField
                            name="title"
                            label="Title"
                            control={control}
                            rules={{ required: "Title is required" }}
                            fullWidth
                        />
                        <FormImageSelectUpload
                            name="image"
                            label="Upload Personality Image"
                            control={control}
                        />
                        <FormTextArea
                            name="description"
                            label="Description"
                            control={control}
                            rules={{ required: "Description is required" }}
                            fullWidth
                        />
                        <FormTextField
                            name="website"
                            label="Website Link (Optional)"
                            control={control}
                            fullWidth
                        />
                        <FormTextField
                            name="twitter"
                            label="Twitter/X Link (Optional)"
                            control={control}
                            fullWidth
                        />
                        <FormTextField
                            name="facebook"
                            label="Facebook Link (Optional)"
                            control={control}
                            fullWidth
                        />
                        <FormTextField
                            name="instagram"
                            label="Instagram Link (Optional)"
                            control={control}
                            fullWidth
                        />
                        <FormTextField
                            name="linkedin"
                            label="LinkedIn Link (Optional)"
                            control={control}
                            fullWidth
                        />
                        <FormTextField
                            name="youtube"
                            label="YouTube Link (Optional)"
                            control={control}
                            fullWidth
                        />
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Stack
                                    direction="row"
                                    sx={{ alignItems: "center", gap: 1 }}>
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) =>
                                            field.onChange(e.target.checked)
                                        }
                                    />
                                    <Typography variant="body2">
                                        Active
                                    </Typography>
                                </Stack>
                            )}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}>
                                Save Personality
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setEditingPersonality(null);
                                    setTabValue(0);
                                }}
                                disabled={loading}>
                                Back
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </CustomTabPanel>
        </>
    );
}
