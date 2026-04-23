import { type TextFieldProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

export interface SearchInputProps extends Omit<
    TextFieldProps,
    "onChange" | "value"
> {
    value: string;
    onChange: (value: string) => void;
    debounceMs?: number;
    showClearButton?: boolean;
    onClear?: () => void;
}

/**
 * A reusable search input field with debounce, clear button, and search icon.
 */
const SearchInputField = ({
    value,
    onChange,
    debounceMs = 300,
    showClearButton = true,
    onClear,
    ...textFieldProps
}: SearchInputProps) => {
    const [inputValue, setInputValue] = useState(value);

    // Debounce the onChange call
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [inputValue, debounceMs, onChange, value]);

    // Sync with external value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleClear = () => {
        setInputValue("");
        onChange("");
        onClear?.();
    };

    return (
        <TextField
            {...textFieldProps}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            size="small"
            fullWidth
            sx={{
                "& input": {
                    fontSize: "0.8rem",
                },
            }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: showClearButton && inputValue && (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="clear search">
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default SearchInputField;
