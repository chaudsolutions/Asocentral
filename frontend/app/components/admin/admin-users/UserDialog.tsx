import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormTextField from "~/components/form-fields/FormTextField";
import FormPasswordField from "~/components/form-fields/FormPasswordField";
import FormSelect from "~/components/form-fields/FormSelect";
import type { UserRole, UserType } from "~/types/user";
import { createUser, updateUser } from "~/hooks/useUserApi";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

interface UserDialogProps {
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
    initialData: UserType | null;
}

interface IUserFormInput {
    name: string;
    email: string;
    role: UserRole;
    password: string;
}

const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
];

export default function UserDialog({
    open,
    handleClose,
    refetch,
    initialData,
}: UserDialogProps) {
    const isEdit = !!initialData;
    const { showToast } = useToast();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<IUserFormInput>({
        defaultValues: {
            name: "",
            email: "",
            role: "user",
            password: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: initialData?.name || "",
                email: initialData?.email || "",
                role: initialData?.role || "user",
                password: "",
            });
        }
    }, [open, initialData, reset]);

    const onSubmit: SubmitHandler<IUserFormInput> = async (data) => {
        const payload = {
            name: data.name,
            email: data.email,
            role: data.role,
            ...(data.password ? { password: data.password } : {}),
        };

        try {
            const res = isEdit
                ? await updateUser(initialData?._id || "", payload)
                : await createUser(payload);

            refetch();
            showToast(res.message, "success");
            handleClose();
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message || "Something went wrong",
                    "error",
                );
            } else {
                showToast("Something went wrong", "error");
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 800, textAlign: "center", pt: 3 }}>
                {isEdit ? "Edit User" : "Add New User"}
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 3, py: 1 }}>
                        <FormTextField
                            name="name"
                            label="Full Name"
                            control={control}
                            rules={{ required: "Name is required" }}
                        />
                        <FormTextField
                            name="email"
                            label="Email Address"
                            type="email"
                            control={control}
                            rules={{ required: "Email is required" }}
                        />
                        <FormSelect
                            name="role"
                            label="Role"
                            control={control}
                            options={roleOptions}
                            disabled
                            rules={{ required: "Role is required" }}
                        />
                        <FormPasswordField
                            name="password"
                            label={
                                isEdit ? "New Password (optional)" : "Password"
                            }
                            control={control}
                            rules={
                                isEdit
                                    ? {
                                          minLength: {
                                              value: 6,
                                              message:
                                                  "Password must be at least 6 characters",
                                          },
                                      }
                                    : {
                                          required: "Password is required",
                                          minLength: {
                                              value: 6,
                                              message:
                                                  "Password must be at least 6 characters",
                                          },
                                      }
                            }
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
                    <Button
                        onClick={handleClose}
                        variant="text"
                        color="inherit">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ bgcolor: "#003366", px: 4 }}>
                        Save User
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
