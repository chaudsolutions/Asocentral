import { useState } from "react";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadImage } from "~/hooks/useUpload";

interface FormImageUploadProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
}

export default function FormImageUpload<T extends FieldValues>({
    name,
    control,
    label,
}: FormImageUploadProps<T>) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        onChange: (value: string) => void,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                const uploadedUrl = await uploadImage(base64);
                onChange(uploadedUrl); // Update RHF state with the URL
                setUploading(false);
            };
        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Box
                    sx={{
                        border: "1px dashed #ccc",
                        p: 2,
                        borderRadius: 1,
                        textAlign: "center",
                    }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 700 }}>
                        {label}
                    </Typography>

                    {value && (
                        <Box
                            component="img"
                            src={value}
                            sx={{
                                width: "100%",
                                height: 150,
                                objectFit: "cover",
                                borderRadius: 1,
                                mb: 2,
                            }}
                        />
                    )}

                    <Button
                        variant="outlined"
                        component="label"
                        disabled={uploading}
                        startIcon={
                            uploading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <CloudUploadIcon />
                            )
                        }
                        fullWidth>
                        {uploading
                            ? "Uploading..."
                            : value
                              ? "Change Image"
                              : "Upload Image"}
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, onChange)}
                        />
                    </Button>
                    {error && (
                        <Typography variant="caption" color="error">
                            {error.message}
                        </Typography>
                    )}
                </Box>
            )}
        />
    );
}
