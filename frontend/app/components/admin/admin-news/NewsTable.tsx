import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import type { NewsDataType } from "~/types/news";

interface NewsTableProps {
    data: NewsDataType[];
    isLoading: boolean;
    onEdit: (news: NewsDataType) => void;
    onView: (news: NewsDataType) => void;
}

export default function NewsTable({
    data,
    isLoading,
    onEdit,
    onView,
}: NewsTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeRow, setActiveRow] = useState<NewsDataType | null>(null);

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        row: NewsDataType,
    ) => {
        setAnchorEl(event.currentTarget);
        setActiveRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveRow(null);
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
                        <TableCell sx={{ fontWeight: 700 }}>Headline</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                            Published
                        </TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row._id} hover>
                            <TableCell sx={{ fontWeight: 600, maxWidth: 300 }}>
                                {row.title}
                            </TableCell>
                            <TableCell>
                                {row.category.map((cat) => (
                                    <Chip
                                        key={cat}
                                        label={cat}
                                        size="small"
                                        sx={{ mr: 0.5 }}
                                    />
                                ))}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={row.active ? "Active" : "Draft"}
                                    color={row.active ? "success" : "default"}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                {new Date(row.pubDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={(e) => handleMenuOpen(e, row)}>
                                    <MoreVertIcon />
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
                    onClick={() => {
                        onView(activeRow!);
                        handleMenuClose();
                    }}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onEdit(activeRow!);
                        handleMenuClose();
                    }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    {activeRow?.active ? (
                        <>
                            <ToggleOffIcon
                                fontSize="small"
                                sx={{ mr: 1, color: "warning.main" }}
                            />{" "}
                            Deactivate
                        </>
                    ) : (
                        <>
                            <ToggleOnIcon
                                fontSize="small"
                                sx={{ mr: 1, color: "success.main" }}
                            />{" "}
                            Activate
                        </>
                    )}
                </MenuItem>
                <MenuItem
                    onClick={handleMenuClose}
                    sx={{ color: "error.main" }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </TableContainer>
    );
}
