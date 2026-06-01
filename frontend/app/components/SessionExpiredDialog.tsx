import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface Props {
    open: boolean;
    onLogout: () => void;
    onRefresh: () => void;
}

export default function SessionExpiredDialog({ open, onLogout, onRefresh }: Props) {
    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockOutlinedIcon color="warning" />
                    Session Expired
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Your session has expired. Log out to end your session or refresh to log in again.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onLogout} color="error" variant="outlined">
                    Logout
                </Button>
                <Button onClick={onRefresh} variant="contained">
                    Refresh Session
                </Button>
            </DialogActions>
        </Dialog>
    );
}
