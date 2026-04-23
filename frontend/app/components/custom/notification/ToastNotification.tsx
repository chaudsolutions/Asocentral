import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { ToastState } from "~/types/others";

const ToastNotification = ({
    open,
    onClose,
    severity,
    message,
}: {
    open: boolean;
    onClose: () => void;
    severity: ToastState["severity"];
    message: string;
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert onClose={onClose} variant="standard" severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ToastNotification;
