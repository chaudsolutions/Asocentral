import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";

interface Option {
    value: string | number;
    label: string;
}

interface FormSelectProps<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    options: Option[];
    rules?: Record<string, unknown>;
    placeholder?: string;
    disabled?: boolean;
}

const FormSelect = <T extends FieldValues>({
    name,
    label,
    control,
    options,
    rules,
    placeholder = "Select",
    disabled = false,
}: FormSelectProps<T>) => {
    return (
        <Box>
            {label && (
                <InputLabel
                    sx={{
                        fontSize: ".8rem",
                    }}>
                    {label}
                </InputLabel>
            )}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <Box>
                        <Select
                            {...field}
                            size="small"
                            fullWidth
                            displayEmpty
                            disabled={disabled}
                            error={!!error}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return placeholder;
                                }
                                const selectedOption = options.find(
                                    (opt) =>
                                        String(opt.value) === String(selected),
                                );
                                return (
                                    selectedOption?.label || String(selected)
                                );
                            }}
                            sx={{
                                fontSize: ".8rem",
                            }}>
                            {options.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                        fontSize: ".8rem",
                                        whiteSpace: "wrap",
                                    }}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {error && (
                            <FormHelperText error sx={{ fontSize: ".8rem" }}>
                                {error.message}
                            </FormHelperText>
                        )}
                    </Box>
                )}
            />
        </Box>
    );
};

export default FormSelect;
