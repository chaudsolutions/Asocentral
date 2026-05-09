import type { RadioGroupProps } from "@mui/material/RadioGroup";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

interface RadioOption {
    value: string | number | boolean;
    label: string;
}

interface FormRadioGroupProps<T extends FieldValues> extends Omit<
    RadioGroupProps,
    "name"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    options: RadioOption[];
    rules?: Record<string, unknown>;
    row?: boolean;
}

const FormRadioGroup = <T extends FieldValues>({
    name,
    label,
    control,
    options,
    rules,
    row = true,
    ...radioGroupProps
}: FormRadioGroupProps<T>) => {
    return (
        <FormControl
            component="fieldset"
            sx={{
                display: "flex",
                flexDirection: row ? "row" : "column",
            }}>
            {label && (
                <FormLabel
                    component="legend"
                    sx={{
                        fontSize: ".8rem",
                    }}>
                    {label}
                </FormLabel>
            )}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <RadioGroup
                        {...field}
                        {...radioGroupProps}
                        row={row}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.label}
                                value={option.value}
                                control={<Radio size="small" />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                )}
            />
        </FormControl>
    );
};

export default FormRadioGroup;
