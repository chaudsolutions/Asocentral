import { type Control } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormMultiAutocomplete from "~/components/form-fields/FormMultiAutocomplete";
import type { NewsFormData } from "./NewsEditorStepper";
import FormMultiAutocompleteFreeSolo from "~/components/form-fields/FormMultiAutocompleteFreeSolo";
import type { UserType } from "~/types/user";

interface Props {
    control: Control<NewsFormData>;
    countries: string[];
    creators: UserType[];
    isCreatorsLoading: boolean;
}

export default function NewsMetadataForm({
    control,
    countries,
    creators,
    isCreatorsLoading,
}: Props) {
    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#003366" }}>
                    Metadata & Authorship
                </Typography>
            </Grid>

            <Grid size={12}>
                <FormMultiAutocomplete
                    name="country"
                    label="Target Countries"
                    control={control}
                    options={countries}
                    getOptionLabel={(option) => option}
                    isEqual={(option, value) => option === value}
                    placeholder="Select countries"
                />
            </Grid>

            <Grid size={12}>
                <FormMultiAutocomplete
                    name="creator"
                    label="Creators / Authors"
                    control={control}
                    options={creators}
                    getOptionLabel={(option) => option?.name || ""}
                    isEqual={(option, value) => option._id === value._id}
                    loading={isCreatorsLoading}
                    placeholder="Select creators"
                />
            </Grid>

            <Grid size={12}>
                <FormMultiAutocompleteFreeSolo
                    name="keywords"
                    label="SEO Keywords"
                    control={control}
                    placeholder="Type keywords and press enter"
                />
            </Grid>
        </Grid>
    );
}
