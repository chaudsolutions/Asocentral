import { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { UserType } from "~/types/user";

interface UserTableProps {
    data: UserType[];
    isLoading: boolean;
    onEdit: (user: UserType) => void;
    onDelete: (user: UserType) => void;
    onView: (user: UserType) => void;
}

export default function UserTable({
    data,
    isLoading,
    onEdit,
    onDelete,
    onView,
}: UserTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeRow, setActiveRow] = useState<UserType | null>(null);

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        user: UserType,
    ) => {
        setAnchorEl(event.currentTarget);
        setActiveRow(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveRow(null);
    };

    const handleMenuAction = (action: () => void) => {
        action();
        handleMenuClose();
    };

    if (isLoading) return <Skeleton variant="rectangular" height={400} />;

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #eee" }}>
            <Table size="small">
                <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Pending</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Typography
                                    variant="body2"
                                    sx={{ py: 4, textAlign: "center" }}>
                                    No users found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {data.map((user) => (
                        <TableRow key={user._id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>
                                {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Chip
                                    label={user.role}
                                    size="small"
                                    color={
                                        user.role === "admin"
                                            ? "primary"
                                            : "default"
                                    }
                                    sx={{
                                        fontSize: ".75rem",
                                        textTransform: "capitalize",
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={user.pendingUnpublishedNews || 0}
                                    size="small"
                                    color={
                                        user.pendingUnpublishedNews
                                            ? "warning"
                                            : "default"
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                {user.createdAt
                                    ? new Date(
                                          user.createdAt,
                                      ).toLocaleDateString()
                                    : "-"}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={(event) =>
                                        handleMenuOpen(event, user)
                                    }
                                    size="small">
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem
                    onClick={() =>
                        handleMenuAction(() => onView(activeRow!))
                    }>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleMenuAction(() => onEdit(activeRow!))
                    }>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                {activeRow?.role !== "admin" && (
                    <>
                        <Divider />
                        <MenuItem
                            onClick={() =>
                                handleMenuAction(() => onDelete(activeRow!))
                            }
                            sx={{ color: "error.main" }}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />{" "}
                            Delete
                        </MenuItem>
                    </>
                )}
            </Menu>
        </TableContainer>
    );
}
