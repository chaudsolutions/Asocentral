import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useNewsCategories } from "~/hooks/useCaching";
import { appName } from "~/utils/constants";
import type { NewsCategoryType } from "~/types/news";
import CategoryTable from "~/components/admin/admin-category/CategoryTable";
import CategoryDialog from "~/components/admin/admin-category/CategoryDialog";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import { deleteNewsCategory } from "~/hooks/useNewsCategories";
import { useToast } from "~/context/ToastContext";
import { isAxiosError } from "axios";

export function meta() {
    return [{ title: `Admin Category | ${appName}` }];
}

export default function AdminCategory() {
    const { confirm } = useConfirmDialog();
    const { showToast } = useToast();
    const {
        newsCategories = [],
        isNewsCategoriesLoading,
        refetchNewsCategories,
    } = useNewsCategories();

    // State for Dialog
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<NewsCategoryType | null>(null);

    const handleOpen = (category: NewsCategoryType | null = null) => {
        setSelectedCategory(category);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCategory(null);
    };

    const handleDelete = async (category: NewsCategoryType) => {
        await confirm({
            title: `Delete ${category.name} Category`,
            message: "Are you sure you want to delete this category?",
            confirmText: "Delete",
            confirmColor: "error",
            cancelText: "No",
            onConfirm: async () => {
                try {
                    const res = await deleteNewsCategory(category?._id || "");

                    showToast(res.message, "success");
                    refetchNewsCategories();
                } catch (error) {
                    if (isAxiosError(error)) {
                        showToast(
                            error.response?.data?.message ||
                                "Something went wrong",
                            "error",
                        );
                    } else {
                        showToast("Something went wrong", "error");
                    }
                }
            },
        });
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 4,
                    alignItems: "center",
                }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    Category Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => handleOpen()}
                    sx={{ bgcolor: "#003366" }}>
                    Add Category
                </Button>
            </Box>

            <CategoryTable
                data={newsCategories}
                isLoading={isNewsCategoriesLoading}
                onEdit={handleOpen}
                onDelete={handleDelete}
            />

            <CategoryDialog
                open={open}
                handleClose={handleClose}
                refetch={refetchNewsCategories}
                initialData={selectedCategory}
            />
        </>
    );
}
