import { useState, useRef, useEffect } from "react";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MovieIcon from "@mui/icons-material/Movie";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

interface FormVideoUploadProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
}

export default function FormVideoUpload<T extends FieldValues>({
    name,
    control,
    label = "Upload Video",
}: FormVideoUploadProps<T>) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                useEffect(() => {
                    if (value instanceof File) {
                        const objectUrl = URL.createObjectURL(value);
                        setPreview(objectUrl);
                        return () => URL.revokeObjectURL(objectUrl);
                    } else if (typeof value === "string") {
                        setPreview(value);
                    } else {
                        setPreview(null);
                    }
                }, [value]);

                return (
                    <Box
                        sx={{
                            border: "1px dashed",
                            borderColor: error ? "error.main" : "#ccc",
                            p: 2,
                            borderRadius: 1,
                        }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 700 }}>
                            {label}
                        </Typography>

                        {preview ? (
                            <Stack spacing={2}>
                                <Box
                                    component="video"
                                    src={preview}
                                    controls
                                    sx={{
                                        width: "100%",
                                        maxHeight: 200,
                                        borderRadius: 1,
                                        bgcolor: "black",
                                    }}
                                />
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    size="small"
                                    onClick={() => onChange(null)}>
                                    Remove Video
                                </Button>
                            </Stack>
                        ) : (
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<MovieIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{ py: 2, borderStyle: "dashed" }}>
                                Select Video File
                            </Button>
                        )}

                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="video/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onChange(file);
                            }}
                        />
                        {error && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1, display: "block" }}>
                                {error.message}
                            </Typography>
                        )}
                    </Box>
                );
            }}
        />
    );
}
