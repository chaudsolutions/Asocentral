import { type TextFieldProps } from "@mui/material";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

import IconButton from "@mui/material/IconButton";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface FormPasswordFieldProps<T extends FieldValues> extends Omit<
    TextFieldProps,
    "name"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
    showPasswordToggle?: boolean;
}

const FormPasswordField = <T extends FieldValues>({
    name,
    control,
    rules,
    showPasswordToggle = true,
    ...textFieldProps
}: FormPasswordFieldProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    type={showPassword ? "text" : "password"}
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    slotProps={{
                        input: {
                            endAdornment: showPasswordToggle ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        size="small">
                                        {showPassword ? (
                                            <VisibilityOff
                                                fontSize="small"
                                                color="inherit"
                                            />
                                        ) : (
                                            <Visibility
                                                fontSize="small"
                                                color="inherit"
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ) : undefined,
                        },
                    }}
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

export default FormPasswordField;
