import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { Link } from "react-router";
import type { NewsDataType } from "~/types/news";
import { formatDate } from "~/hooks/useTools";
import { useFuzzySearch } from "~/hooks/useFuzzySearch";
import { highlightText } from "~/utils/highlightText";
import type { FuseResult } from "fuse.js";

type Props = {
    open: boolean;
    onClose: () => void;
    data: NewsDataType[];
    loading?: boolean;
};

export default function SearchOverlay({ open, onClose, data, loading }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { query, setQuery, rawResults } = useFuzzySearch<NewsDataType>({
        data,
        keys: ["title", "description", "keywords"],
    });

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    if (!open) return null;

    return (
        <ClickAwayListener onClickAway={onClose}>
            <Paper
                elevation={8}
                sx={{
                    position: "absolute",
                    top: { xs: 8, md: 10 },
                    right: { xs: 8, md: 24 },
                    left: { xs: 8, md: "auto" },
                    width: { xs: "auto", md: 520 },
                    zIndex: 1500,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        bgcolor: "background.paper",
                    }}>
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        placeholder="Search news..."
                        value={query}
                        size="small"
                        onChange={(e) => setQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <IconButton onClick={onClose} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        maxHeight: 430,
                        overflowY: "auto",
                        bgcolor: "background.paper",
                        borderTop: "1px solid",
                        borderColor: "divider",
                    }}>
                    {!query.trim() ? (
                        <Box sx={{ py: 5, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Start typing to search news...
                            </Typography>
                        </Box>
                    ) : loading ? (
                        <Stack spacing={1} sx={{ p: 2 }}>
                            <Skeleton height={48} />
                            <Skeleton height={48} />
                            <Skeleton height={48} />
                        </Stack>
                    ) : rawResults.length === 0 ? (
                        <Box sx={{ py: 5, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                No results found
                            </Typography>
                        </Box>
                    ) : (
                        <Stack>
                            {rawResults
                                .slice(0, 8)
                                .map(
                                    (
                                        result: FuseResult<NewsDataType>,
                                        index: number,
                                    ) => {
                                        const news = result.item;

                                        const titleMatch = result.matches?.find(
                                            (m) => m.key === "title",
                                        );

                                        return (
                                            <Box
                                                key={news._id || index}
                                                component={Link}
                                                to={
                                                    news._id
                                                        ? `/news/${news.article_id}`
                                                        : news.link
                                                }
                                                target={
                                                    news._id
                                                        ? "_self"
                                                        : "_blank"
                                                }
                                                onClick={onClose}
                                                sx={{
                                                    display: "flex",
                                                    gap: 1.5,
                                                    p: 1.25,
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    borderBottom: "1px solid",
                                                    borderColor: "divider",
                                                    "&:hover": {
                                                        bgcolor: "action.hover",
                                                    },
                                                }}>
                                                <Box
                                                    component="img"
                                                    src={news.image_url}
                                                    alt={news.title}
                                                    sx={{
                                                        width: 86,
                                                        height: 58,
                                                        objectFit: "cover",
                                                        borderRadius: 1.5,
                                                        flexShrink: 0,
                                                        bgcolor: "grey.100",
                                                    }}
                                                />

                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography
                                                        noWrap
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: "0.85rem",
                                                            color: "#222",
                                                        }}>
                                                        {titleMatch?.indices
                                                            ? highlightText(
                                                                  news.title,
                                                                  titleMatch.indices,
                                                              )
                                                            : news.title}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary">
                                                        {formatDate(
                                                            news.pubDate,
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    },
                                )}
                        </Stack>
                    )}
                </Box>
            </Paper>
        </ClickAwayListener>
    );
}
