import { type Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNewsCategories } from "~/hooks/useCaching";
import FormTextField from "~/components/form-fields/FormTextField";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormMultiAutocomplete from "~/components/form-fields/FormMultiAutocomplete";
import FormImageUpload from "~/components/form-fields/FormImageUpload";
import type { NewsCategoryType } from "~/types/news";
import type { NewsFormData } from "./NewsEditorStepper";
import FormDatePicker from "~/components/form-fields/FormDatePicker";

interface Props {
    control: Control<NewsFormData>;
}

export default function NewsBasicInfoForm({ control }: Props) {
    const { newsCategories = [] } = useNewsCategories();

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#003366" }}>
                General Information
            </Typography>

            <FormTextField
                name="title"
                label="Article Headline"
                control={control}
                rules={{ required: "Headline is required" }}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { md: "1fr 1fr" },
                    gap: 2,
                }}>
                <FormMultiAutocomplete
                    name="category"
                    label="Categories"
                    control={control}
                    options={newsCategories}
                    getOptionLabel={(option: NewsCategoryType) => option.name}
                    isEqual={(option, value) => option._id === value._id}
                    placeholder="Select categories"
                />
            </Box>

            {/* NEW: Automated Image Upload */}
            <FormImageUpload
                name="image_url"
                label="Cover Image"
                control={control}
            />

            <FormTextArea
                name="description"
                label="Short Summary / Excerpt"
                control={control}
                rules={{ required: "Summary is required" }}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { md: "1fr 1fr" },
                    gap: 2,
                }}>
                <FormTextField
                    name="link"
                    label="Original Source Link"
                    control={control}
                />
                <FormTextField
                    name="video_url"
                    label="Video URL (Optional)"
                    control={control}
                />
            </Box>

            {/* NEW: Proper Date Picker */}
            <FormDatePicker
                name="pubDate"
                label="Publication Date"
                control={control}
            />
        </Box>
    );
}
