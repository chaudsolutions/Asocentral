import type { SwitchProps } from "@mui/material/Switch";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface FormSwitchProps<T extends FieldValues> extends Omit<
    SwitchProps,
    "name"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
}

const FormSwitch = <T extends FieldValues>({
    name,
    label,
    control,
    rules,
    ...switchProps
}: FormSwitchProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <FormControlLabel
                    control={
                        <Switch
                            {...field}
                            {...switchProps}
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            onBlur={field.onBlur}
                        />
                    }
                    label={label && label}
                />
            )}
        />
    );
};

export default FormSwitch;
