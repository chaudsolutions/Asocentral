import { type TextFieldProps } from "@mui/material";
import TextField from "@mui/material/TextField";

interface InputTextFieldProps extends Omit<TextFieldProps, "name"> {
    label?: string;
}

const InputTextField = ({ ...textFieldProps }: InputTextFieldProps) => {
    return (
        <TextField
            {...textFieldProps}
            size="small"
            fullWidth
            sx={{
                "& input": {
                    fontSize: "0.8rem",
                },
            }}
        />
    );
};

export default InputTextField;
