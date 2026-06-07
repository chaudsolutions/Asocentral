import React, { useState, useRef, useCallback } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";

// Use a Generic T for the form data structure
interface ImageSelectUploadProps<T extends FieldValues> {
    name: Path<T>; // Path ensures 'name' exists in your form data
    control: Control<T>;
    label?: string;
    maxSize?: number;
    accept?: string;
    uploading?: boolean;
    rules?: Record<string, unknown>;
}

const FormImageSelectUpload = <T extends FieldValues>({
    name,
    control,
    label = "Upload Image",
    maxSize = 5 * 1024 * 1024,
    accept = "image/*",
    uploading = false,
    rules,
}: ImageSelectUploadProps<T>) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileSelect = useCallback(
        async (
            event: React.ChangeEvent<HTMLInputElement>,
            onChange: (base64String: string | null) => void,
        ) => {
            const file = event.target.files?.[0];

            if (!file) return;

            // Validate file size
            if (file.size > maxSize) {
                alert(
                    `File exceeds the maximum size of ${maxSize / 1024 / 1024}MB`,
                );
                return;
            }

            try {
                // Convert file to base64
                const base64 = await fileToBase64(file);

                // Revoke previous preview URL if it was an object URL
                if (preview && preview.startsWith("blob:")) {
                    URL.revokeObjectURL(preview);
                }

                // Set preview to base64 string
                setPreview(base64);

                // Update form with base64 string
                onChange(base64);

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } catch (error) {
                console.error("Error converting file to base64:", error);
                alert("Failed to process image. Please try again.");
            }
        },
        [maxSize, preview],
    );

    const handleRemoveImage = useCallback(
        (onChange: (base64String: string | null) => void) => {
            // Clear preview
            setPreview(null);
            onChange(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [],
    );

    const handleReplaceClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Box>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept={accept}
                        onChange={(e) => handleFileSelect(e, onChange)}
                        style={{ display: "none" }}
                        id={`image-upload-${name}`}
                    />

                    {!value && !preview && (
                        <Box>
                            <label htmlFor={`image-upload-${name}`}>
                                <Button
                                    component="span"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                    color={error ? "error" : "primary"}
                                    sx={{
                                        py: 2,
                                        borderStyle: "dashed",
                                        "&:hover": {
                                            borderStyle: "dashed",
                                        },
                                    }}>
                                    {label}
                                    <Typography variant="caption" sx={{ ml: 1 }}>
                                        (Max {maxSize / 1024 / 1024}MB)
                                    </Typography>
                                </Button>
                            </label>
                            {error && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 0.5, display: "block" }}>
                                    {error.message}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {uploading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress />
                            <Typography
                                variant="caption"
                                color="text.secondary">
                                Uploading image...
                            </Typography>
                        </Box>
                    )}

                    {(value || preview) && (
                        <Stack
                            sx={{
                                direction: "row",
                                alignItems: "center",
                                spacing: 2,
                            }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                badgeContent={
                                    <IconButton
                                        size="small"
                                        onClick={handleReplaceClick}
                                        sx={{
                                            bgcolor: "primary.main",
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "primary.dark",
                                            },
                                            width: 32,
                                            height: 32,
                                        }}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                }>
                                <Avatar
                                    src={preview || value || undefined}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: "2px solid",
                                        borderColor: "divider",
                                        bgcolor: "grey.100",
                                    }}>
                                    <AddPhotoAlternateIcon
                                        sx={{
                                            fontSize: 40,
                                            color: "text.disabled",
                                        }}
                                    />
                                </Avatar>
                            </Badge>

                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveImage(onChange)}
                                    sx={{
                                        border: 1,
                                        borderColor: "error.light",
                                    }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    )}
                </Box>
            )}
        />
    );
};

export default FormImageSelectUpload;
