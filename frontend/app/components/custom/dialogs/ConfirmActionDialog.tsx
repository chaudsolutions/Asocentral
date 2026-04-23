import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface ConfirmActionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?:
        | "primary"
        | "secondary"
        | "error"
        | "success"
        | "warning"
        | "info";
    loading?: boolean;
}

const ConfirmActionDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "primary",
    loading = false,
}: ConfirmActionDialogProps) => {
    const getIcon = () => {
        if (confirmColor === "error") {
            return <WarningOutlinedIcon color="error" fontSize="large" />;
        } else if (confirmColor === "warning") {
            return <WarningOutlinedIcon color="warning" fontSize="large" />;
        } else if (confirmColor === "info") {
            return <InfoOutlinedIcon color="info" fontSize="large" />;
        }
        return <CheckOutlinedIcon color="success" fontSize="large" />;
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                    p: 2,
                },
            }}>
            {title && (
                <DialogTitle
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        textAlign: "center",
                        pt: 2,
                    }}>
                    {title}
                </DialogTitle>
            )}
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    pt: title ? 2 : 4,
                }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        border: 1,
                        borderColor: `${confirmColor}.main`,
                        p: 2,
                        width: 60,
                        height: 60,
                    }}>
                    {getIcon()}
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "center",
                        fontSize: ".9rem",
                    }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{ justifyContent: "space-between", p: 2, pt: 1 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onClose}
                    disabled={loading}
                    size="large"
                    sx={{
                        textTransform: "none",
                        borderRadius: 6,
                        fontSize: ".875rem",
                        px: 4,
                        minWidth: 100,
                    }}>
                    {cancelText}
                </Button>
                <Button
                    variant="contained"
                    color={confirmColor}
                    onClick={onConfirm}
                    loading={loading}
                    size="large"
                    startIcon={
                        loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : undefined
                    }
                    sx={{
                        textTransform: "none",
                        borderRadius: 6,
                        fontSize: ".875rem",
                        px: 4,
                        minWidth: 100,
                    }}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmActionDialog;
