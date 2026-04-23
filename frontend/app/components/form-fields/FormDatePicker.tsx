import { Controller, type Control } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface FormDatePickerProps {
    name: string;
    label: string;
    rules?: object;
    control: Control;
}

export const FormDatePicker = ({
    name,
    label,
    rules,
    control,
}: FormDatePickerProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <DatePicker
                        label={label}
                        value={value || null} // Ensure it doesn't crash on undefined
                        onChange={(newValue) => onChange(newValue)}
                        slotProps={{
                            textField: {
                                error: !!error,
                                helperText: error?.message,
                                fullWidth: true,
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};
