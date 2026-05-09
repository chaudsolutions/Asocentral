import type { AutocompleteProps } from "@mui/material/Autocomplete";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface FormMultiAutocompleteProps<
    T extends FieldValues,
    Option,
> extends Omit<
    AutocompleteProps<Option, true, false, false>,
    "renderInput" | "onChange" | "value" | "renderTags"
> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    getOptionLabel: (option: Option) => string;
    rules?: Record<string, unknown>;
    placeholder?: string;
    isEqual?: (option: Option, value: Option) => boolean;
    showSelectedBelow?: boolean;
    selectedItemRenderer?: (
        option: Option,
        onRemove: () => void,
    ) => React.ReactNode;
}

const FormMultiAutocomplete = <T extends FieldValues, Option>({
    name,
    control,
    getOptionLabel,
    rules,
    placeholder = "Select options",
    isEqual = (option, value) => option === value,
    ...autocompleteProps
}: FormMultiAutocompleteProps<T, Option>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field: { onChange, value, ref },
                fieldState: { error },
            }) => {
                const selectedValues = value || [];

                return (
                    <Autocomplete
                        {...autocompleteProps}
                        multiple
                        value={selectedValues}
                        onChange={(_, newValue) => {
                            onChange(newValue);
                        }}
                        size="small"
                        isOptionEqualToValue={isEqual}
                        getOptionLabel={getOptionLabel}
                        // Clear renderTags to remove chips from input
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={ref}
                                size="small"
                                placeholder={placeholder}
                                error={!!error}
                                helperText={error?.message}
                                sx={{
                                    "& input": {
                                        fontSize: "0.8rem",
                                    },
                                }}
                            />
                        )}
                    />
                );
            }}
        />
    );
};

export default FormMultiAutocomplete;
