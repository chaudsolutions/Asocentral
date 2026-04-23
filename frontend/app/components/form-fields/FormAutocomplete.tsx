import { type AutocompleteProps } from "@mui/material";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import Typography from "@mui/material/Typography";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

interface FormAutocompleteProps<T extends FieldValues, Option> extends Omit<
    AutocompleteProps<Option, false, true, false>,
    "renderInput" | "onChange" | "value" | "renderTags"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    getOptionLabel: (option: Option) => string;
    rules?: Record<string, unknown>;
    placeholder?: string;
    isEqual?: (option: Option, value: Option) => boolean;
    onChange?: (event: React.SyntheticEvent, value: Option | null) => void;
}

const FormAutocomplete = <T extends FieldValues, Option>({
    name,
    control,
    getOptionLabel,
    rules,
    placeholder = "Select",
    isEqual = (option, value) => option === value,
    onChange: externalOnChange,
    ...autocompleteProps
}: FormAutocompleteProps<T, Option>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                    {...autocompleteProps}
                    value={value || undefined}
                    onChange={(event, newValue) => {
                        // Call the internal react-hook-form onChange
                        onChange(newValue);
                        // Call the external onChange if provided
                        if (externalOnChange) {
                            externalOnChange(event, newValue);
                        }
                    }}
                    isOptionEqualToValue={isEqual}
                    getOptionLabel={getOptionLabel}
                    disableClearable={true}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder={placeholder}
                            error={!!error}
                            helperText={error?.message}
                            label={autocompleteProps.label}
                            sx={{
                                "& input": {
                                    fontSize: ".8rem",
                                },
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <MenuItem {...props} key={getOptionLabel(option)}>
                            <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                    whiteSpace: "normal",
                                }}>
                                {getOptionLabel(option)}
                            </Typography>
                        </MenuItem>
                    )}
                />
            )}
        />
    );
};

export default FormAutocomplete;
