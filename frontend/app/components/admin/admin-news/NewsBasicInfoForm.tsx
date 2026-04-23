import { type Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNewsCategories } from "~/hooks/useCaching";
import FormTextField from "~/components/form-fields/FormTextField";
import FormTextArea from "~/components/form-fields/FormTextArea";
import FormMultiAutocomplete from "~/components/form-fields/FormMultiAutocomplete";
import type { INewsFormInput } from "~/types/news";
import type { NewsCategoryType } from "~/types/news";

interface Props {
    control: Control<INewsFormInput>;
}

export default function NewsBasicInfoForm({ control }: Props) {
    const { newsCategories = [] } = useNewsCategories();

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
                <FormTextField
                    name="article_id"
                    label="Article ID / Reference"
                    control={control}
                    rules={{ required: "Article ID is required" }}
                />

                <FormMultiAutocomplete
                    name="category"
                    label="Categories"
                    control={control}
                    options={newsCategories}
                    getOptionLabel={(option: NewsCategoryType) => option.name}
                    isEqual={(option, value) => option._id === value._id}
                    placeholder="Select one or more categories"
                />
            </Box>

            <FormTextField
                name="image_url"
                label="Main Cover Image URL"
                control={control}
                rules={{ required: "Cover image is required" }}
            />

            <FormTextArea
                name="description"
                label="Short Summary / Excerpt"
                control={control}
                rules={{
                    required: "Summary is required",
                    maxLength: {
                        value: 300,
                        message: "Summary should be under 300 characters",
                    },
                }}
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

            <FormTextField
                name="pubDate"
                label="Publication Date String"
                control={control}
                placeholder="e.g., 2026-04-23 09:00:00"
            />
        </Box>
    );
}
