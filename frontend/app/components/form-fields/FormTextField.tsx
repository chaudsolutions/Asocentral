import { type TextFieldProps } from "@mui/material";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import TextField from "@mui/material/TextField";

interface FormTextFieldProps<T extends FieldValues> extends Omit<
    TextFieldProps,
    "name"
> {
    name: Path<T>;
    label?: string;
    placeHolder?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
}

const FormTextField = <T extends FieldValues>({
    name,
    label,
    control,
    rules,
    ...textFieldProps
}: FormTextFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    label={label}
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
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

export default FormTextField;
