import { type AutocompleteProps } from "@mui/material";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

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
    showSelectedBelow = true,
    selectedItemRenderer,
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

                const handleRemove = (optionToRemove: Option) => {
                    const newValue = selectedValues.filter(
                        (option) => !isEqual(option, optionToRemove),
                    );
                    onChange(newValue);
                };

                return (
                    <Box>
                        <Autocomplete
                            {...autocompleteProps}
                            multiple
                            value={selectedValues}
                            onChange={(_, newValue) => {
                                onChange(newValue);
                            }}
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

                        {/* Render selected items below the autocomplete */}
                        {showSelectedBelow && selectedValues.length > 0 && (
                            <Box sx={{ mt: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mb: 1 }}>
                                    Selected ({selectedValues.length}):
                                </Typography>
                                <Stack
                                    sx={{
                                        flexWrap: "wrap",
                                        direction: "row",
                                        gap: 1,
                                    }}>
                                    {selectedValues.map((option, index) => {
                                        if (selectedItemRenderer) {
                                            return selectedItemRenderer(
                                                option,
                                                () => handleRemove(option),
                                            );
                                        }

                                        // Default renderer
                                        return (
                                            <Chip
                                                key={index}
                                                label={getOptionLabel(option)}
                                                size="small"
                                                onDelete={() =>
                                                    handleRemove(option)
                                                }
                                                deleteIcon={<CloseIcon />}
                                                variant="outlined"
                                            />
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                );
            }}
        />
    );
};

export default FormMultiAutocomplete;
