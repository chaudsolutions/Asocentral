import { useFieldArray, type Control } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FormTextField from "~/components/form-fields/FormTextField";
import FormTextArea from "~/components/form-fields/FormTextArea";
import type { NewsFormData } from "./NewsEditorStepper";
import FormImageSelectUpload from "~/components/form-fields/FormImageSelectUpload";

export default function NewsContentForm({
    control,
}: {
    control: Control<NewsFormData>;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "content",
    });

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Article Content Blocks
            </Typography>

            {fields.map((field, index) => (
                <Paper
                    key={field.id}
                    variant="outlined"
                    sx={{ p: 3, position: "relative", bgcolor: "#fafafa" }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, color: "#003366" }}>
                        Block #{index + 1}
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <FormImageSelectUpload
                                name={`content.${index}.image_url`}
                                control={control}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormTextField
                                name={`content.${index}.title`}
                                label="Section Title"
                                control={control}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormTextArea
                                name={`content.${index}.description`}
                                label="Section Body"
                                control={control}
                                rules={{
                                    required: `Block ${index + 1} description is required`,
                                }}
                            />
                        </Grid>
                    </Grid>

                    {fields.length > 1 && (
                        <Button
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ mt: 1 }}>
                            Remove Block
                        </Button>
                    )}
                </Paper>
            ))}

            <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() =>
                    append({ title: "", description: "", image_url: null })
                }>
                Add Content Block
            </Button>
        </Box>
    );
}
