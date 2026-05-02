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
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { NewsCategoryType } from "~/types/news";

interface CategoryTableProps {
    data: NewsCategoryType[];
    isLoading: boolean;
    onEdit: (cat: NewsCategoryType) => void;
    onDelete: (cat: NewsCategoryType) => void;
}

export default function CategoryTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: CategoryTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeRow, setActiveRow] = useState<NewsCategoryType | null>(null);

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        category: NewsCategoryType,
    ) => {
        setAnchorEl(event.currentTarget);
        setActiveRow(category);
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
                        <TableCell sx={{ fontWeight: 700 }}>
                            Category Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                            Description
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((cat) => (
                        <TableRow key={cat._id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>
                                {cat.name}
                            </TableCell>
                            <TableCell>{cat.slug}</TableCell>
                            <TableCell>{cat.description}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={(event) =>
                                        handleMenuOpen(event, cat)
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
                        handleMenuAction(() => onEdit(activeRow!))
                    }>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() =>
                        handleMenuAction(() => onDelete(activeRow!))
                    }
                    sx={{ color: "error.main" }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </TableContainer>
    );
}
