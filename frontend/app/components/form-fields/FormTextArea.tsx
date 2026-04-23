import { type TextFieldProps } from "@mui/material";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import TextField from "@mui/material/TextField";

interface FormTextAreaProps<T extends FieldValues> extends Omit<
    TextFieldProps,
    "name"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
    rows?: number;
    placeholder?: string;
}

const FormTextArea = <T extends FieldValues>({
    name,
    control,
    rules,
    rows = 4,
    placeholder = "Enter text",
    ...textFieldProps
}: FormTextAreaProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    multiline
                    rows={rows}
                    placeholder={placeholder}
                    sx={{
                        "& input": {
                            fontSize: "0.8rem",
                        },
                    }}
                />
            )}
        />
    );
};

export default FormTextArea;
