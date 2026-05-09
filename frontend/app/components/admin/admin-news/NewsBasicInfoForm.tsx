import { type Control } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextField from "~/components/form-fields/FormTextField";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormMultiAutocomplete from "~/components/form-fields/FormMultiAutocomplete";
import type { NewsFormData } from "./NewsEditorStepper";
import FormDatePicker from "~/components/form-fields/FormDatePicker";
import FormImageSelectUpload from "~/components/form-fields/FormImageSelectUpload";
import FormVideoUpload from "~/components/form-fields/FormVideoUpload";
import type { NewsCategoryType } from "~/types/news";

interface Props {
    control: Control<NewsFormData>;
    categories: NewsCategoryType[];
    isNewsCategoriesLoading: boolean;
}

export default function NewsBasicInfoForm({
    control,
    categories,
    isNewsCategoriesLoading,
}: Props) {
    return (
        <Grid
            container
            spacing={3}
            sx={{
                alignItems: "center",
            }}>
            <Grid size={12}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#003366" }}>
                    General Information
                </Typography>
            </Grid>

            {/* Compulsory */}
            <Grid size={12}>
                <FormTextField
                    name="title"
                    label="Article Headline"
                    control={control}
                    rules={{ required: "Headline is required" }}
                />
            </Grid>

            {/* Compulsory */}
            <Grid size={12}>
                <FormMultiAutocomplete
                    name="category"
                    label="Categories"
                    control={control}
                    options={categories}
                    loading={isNewsCategoriesLoading}
                    getOptionLabel={(option) => option.name || ""}
                    isEqual={(option, value) => option._id === value._id}
                    placeholder="Select categories"
                    rules={{ required: "Please select at least one category" }}
                />
            </Grid>

            {/* Compulsory */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormImageSelectUpload
                    name="image_url"
                    label="Cover Image"
                    control={control}
                />
            </Grid>
            {/* Replaced with Video Upload */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormVideoUpload
                    name="video_url"
                    label="Article Video"
                    control={control}
                />
            </Grid>

            {/* Compulsory */}
            <Grid size={12}>
                <FormTextArea
                    name="description"
                    label="Short Summary / Excerpt"
                    control={control}
                    rules={{ required: "Summary is required" }}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField
                    name="link"
                    label="Original Source Link"
                    control={control}
                />
            </Grid>

            {/* Compulsory */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormDatePicker
                    name="pubDate"
                    label="Publication Date"
                    control={control}
                    rules={{ required: "Publication date is required" }}
                    maxDate={new Date()}
                />
            </Grid>
        </Grid>
    );
}
