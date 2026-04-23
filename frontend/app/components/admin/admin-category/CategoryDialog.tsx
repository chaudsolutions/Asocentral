import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormTextField from "~/components/form-fields/FormTextField";
import type { NewsCategoryType } from "~/types/news";
import FormTextArea from "~/components/form-fields/FormTextArea";
import {
    createNewsCategory,
    updateNewsCategory,
} from "~/hooks/useNewsCategories";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

interface CategoryDialogProps {
    open: boolean;
    handleClose: () => void;
    refetch: () => void;
    initialData: NewsCategoryType | null;
}

interface ICategoryFormInput {
    name: string;
    slug: string;
    description: string;
}

export default function CategoryDialog({
    open,
    handleClose,
    refetch,
    initialData,
}: CategoryDialogProps) {
    const isEdit = !!initialData;

    const { showToast } = useToast();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm<ICategoryFormInput>({
        defaultValues: {
            name: "",
            slug: "",
        },
    });

    // Auto-generate slug from name
    const categoryName = watch("name");
    useEffect(() => {
        if (!initialData && categoryName) {
            const slug = categoryName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");
            setValue("slug", slug);
        }
    }, [categoryName, setValue, initialData]);

    useEffect(() => {
        if (open) {
            reset(initialData || { name: "", slug: "" });
        }
    }, [open, initialData, reset]);

    const onSubmit: SubmitHandler<ICategoryFormInput> = async (data) => {
        const payload = {
            categoryName: data.name,
            categoryDescription: data.description,
            slug: data.slug,
        };
        try {
            let res;
            if (isEdit) {
                res = await updateNewsCategory(initialData?._id || "", payload);
            } else {
                res = await createNewsCategory(payload);
            }

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
                {initialData ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box sx={{ display: "grid", gap: 3, py: 1 }}>
                        <FormTextField
                            name="name"
                            label="Display Name"
                            control={control}
                            rules={{ required: "Category name is required" }}
                        />
                        <FormTextField
                            name="slug"
                            label="Slug"
                            control={control}
                            disabled
                            rules={{ required: "Slug is required" }}
                        />
                        <FormTextArea
                            name="description"
                            label="Description"
                            control={control}
                            rules={{ required: "Description is required" }}
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
                        Save Category
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
