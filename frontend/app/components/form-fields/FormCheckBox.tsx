import type { CheckboxProps } from "@mui/material/Checkbox";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface FormCheckboxProps<T extends FieldValues> extends Omit<
    CheckboxProps,
    "name"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
    yesNoValue?: boolean;
}

const FormCheckbox = <T extends FieldValues>({
    name,
    label,
    control,
    rules,
    yesNoValue = false,
    ...checkboxProps
}: FormCheckboxProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            {...field}
                            {...checkboxProps}
                            checked={
                                yesNoValue ? field.value === "yes" : field.value
                            }
                            onChange={(e) => {
                                if (yesNoValue) {
                                    field.onChange(
                                        e.target.checked ? "yes" : "no",
                                    );
                                } else {
                                    field.onChange(e.target.checked);
                                }
                            }}
                            onBlur={field.onBlur}
                            size="small"
                        />
                    }
                    label={label && label}
                    sx={{
                        m: 0,
                        p: 0,
                        height: 10,
                    }}
                />
            )}
        />
    );
};

export default FormCheckbox;
