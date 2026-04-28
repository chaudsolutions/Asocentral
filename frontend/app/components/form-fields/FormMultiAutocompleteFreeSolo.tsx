// FormMultiAutocompleteFreeSolo.tsx - New component for freeSolo
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface FormMultiAutocompleteFreeSoloProps<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    control: Control<T>;
    rules?: Record<string, unknown>;
    placeholder?: string;
    loading?: boolean;
}

const FormMultiAutocompleteFreeSolo = <T extends FieldValues>({
    name,
    control,
    rules,
    placeholder = "Type and press enter",
    loading,
}: FormMultiAutocompleteFreeSoloProps<T>) => {
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
                        multiple
                        freeSolo
                        value={selectedValues}
                        onChange={(_, newValue) => {
                            onChange(newValue);
                        }}
                        size="small"
                        options={[]}
                        loading={loading}
                        getOptionLabel={(option) => {
                            if (typeof option === "string") return option;
                            return String(option);
                        }}
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

export default FormMultiAutocompleteFreeSolo;
