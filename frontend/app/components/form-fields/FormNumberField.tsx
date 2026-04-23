import { type TextFieldProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

interface FormNumberFieldProps<T extends FieldValues> extends Omit<
    TextFieldProps,
    "name" | "onChange"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
}

const FormNumberField = <T extends FieldValues>({
    name,
    control,
    rules,
    min,
    max,
    onChange: externalOnChange,
    ...textFieldProps
}: FormNumberFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    type="number"
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    onChange={(e) => {
                        const value = e.target.value;

                        // Handle empty input
                        if (value === "" || value === "-") {
                            field.onChange("");
                            if (externalOnChange) externalOnChange(0);
                            return;
                        }

                        // Convert to number
                        let numValue = Number(value);

                        // Apply max constraint
                        if (
                            max !== undefined &&
                            !isNaN(numValue) &&
                            numValue > max
                        ) {
                            numValue = max;
                            e.target.value = String(max);
                        }

                        // Apply min constraint
                        if (
                            min !== undefined &&
                            !isNaN(numValue) &&
                            numValue < min
                        ) {
                            numValue = min;
                            e.target.value = String(min);
                        }

                        // Update form state
                        if (!isNaN(numValue)) {
                            field.onChange(numValue);
                            if (externalOnChange) externalOnChange(numValue);
                        } else {
                            field.onChange(value);
                        }
                    }}
                    onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== "" && value !== "-") {
                            const numValue = Number(value);

                            if (
                                max !== undefined &&
                                !isNaN(numValue) &&
                                numValue > max
                            ) {
                                field.onChange(max);
                                e.target.value = String(max);
                                if (externalOnChange) externalOnChange(max);
                            }
                            if (
                                min !== undefined &&
                                !isNaN(numValue) &&
                                numValue < min
                            ) {
                                field.onChange(min);
                                e.target.value = String(min);
                                if (externalOnChange) externalOnChange(min);
                            }
                        }
                        field.onBlur();
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

export default FormNumberField;
