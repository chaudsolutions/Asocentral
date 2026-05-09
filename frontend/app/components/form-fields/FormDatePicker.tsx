import type { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

interface FormDatePickerProps<T extends FieldValues> extends Omit<
    DatePickerProps,
    "value" | "onChange"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
    textFieldProps?: TextFieldProps;
    placeholder?: string;
}

const FormDatePicker = <T extends FieldValues>({
    name,
    label,
    control,
    rules,
    ...datePickerProps
}: FormDatePickerProps<T>) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <DatePicker
                        {...datePickerProps}
                        value={value}
                        onChange={onChange}
                        label={label}
                        slotProps={{
                            textField: {
                                size: "small",
                                error: !!error,
                                helperText: error?.message,
                                fullWidth: true,
                            },
                        }}
                        sx={{
                            "& .MuiPickersInputBase-sectionsContainer": {
                                fontSize: ".8rem",
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};

export default FormDatePicker;
