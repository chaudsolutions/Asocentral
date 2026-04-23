import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

interface PhoneNumberInputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    defaultCountry?: string;
    rules?: Record<string, unknown>;
    fullWidth?: boolean;
}

const PhoneNumberInput = <T extends FieldValues>({
    name,
    control,
    label = "Phone Number",
    placeholder = "Enter phone number",
    disabled = false,
    required = false,
    rules,
    fullWidth = true,
}: PhoneNumberInputProps<T>) => {
    const theme = useTheme();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <FormControl
                    fullWidth={fullWidth}
                    error={!!error}
                    disabled={disabled}>
                    {label && (
                        <InputLabel
                            shrink
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                px: 1,
                                ml: -1,
                            }}>
                            {label}
                            {required && " *"}
                        </InputLabel>
                    )}
                    <Box
                        sx={{
                            "& .PhoneInput": {
                                width: "100%",
                            },
                            "& .PhoneInputInput": {
                                width: "100%",
                                padding: ".5rem",
                                borderRadius: 2,
                                border: `1px solid ${
                                    error
                                        ? theme.palette.error.main
                                        : theme.palette.divider
                                }`,
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: ".8rem",
                                "&:focus": {
                                    outline: "none",
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
                                },
                                "&:disabled": {
                                    backgroundColor:
                                        theme.palette.action.disabledBackground,
                                    color: theme.palette.text.disabled,
                                },
                            },
                            "& .PhoneInputCountry": {
                                border: `1px solid ${
                                    error
                                        ? theme.palette.error.main
                                        : theme.palette.divider
                                }`,
                                width: "fit-content",
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                                marginRight: 1,
                                "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            },
                            "& .PhoneInputCountrySelect": {
                                backgroundColor: "transparent",
                                color: theme.palette.text.primary,
                                "&:focus": {
                                    outline: "none",
                                },
                            },
                            "& .PhoneInputCountrySelectArrow": {
                                borderTopColor: theme.palette.text.primary,
                            },
                            "& .PhoneInputCountryIcon": {
                                border: "none",
                                boxShadow: "none",
                            },
                        }}>
                        <PhoneInput
                            international
                            defaultCountry="NG"
                            placeholder={placeholder}
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={disabled}
                        />
                    </Box>
                    {error && (
                        <FormHelperText sx={{ mt: 1, ml: 0 }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
};

export default PhoneNumberInput;
