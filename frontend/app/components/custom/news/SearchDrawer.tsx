import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";

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

export default function SearchDrawer({ open, onClose, data, loading }: Props) {
    const { query, setQuery, rawResults } = useFuzzySearch<NewsDataType>({
        data,
        keys: ["title", "description", "keywords"],
    });

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        height: "80vh",
                        p: 2,
                        borderRadius: "1rem 1rem 0 0",
                    },
                },
            }}>
            {/* Header */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                    fullWidth
                    autoFocus
                    placeholder="Search news..."
                    value={query}
                    size="small"
                    onChange={(e) => setQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Results */}
            <Box sx={{ overflowY: "auto", flex: 1 }}>
                {!query.trim() ? (
                    <Box sx={{ textAlign: "center", mt: 10, color: "#777" }}>
                        Start typing to search news...
                    </Box>
                ) : loading ? (
                    <Skeleton height={40} />
                ) : rawResults.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 10 }}>
                        No results found
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {rawResults.map(
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
                                        target={news._id ? "_self" : "_blank"}
                                        onClick={onClose}
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            textDecoration: "none",
                                            borderBottom: "1px solid #eee",
                                            pb: 2,
                                        }}>
                                        <Box
                                            component="img"
                                            src={news.image_url}
                                            alt={news.title}
                                            sx={{
                                                width: 100,
                                                height: 70,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                            }}
                                        />

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "0.9rem",
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
                                                {formatDate(news.pubDate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            },
                        )}
                    </Stack>
                )}
            </Box>
        </Drawer>
    );
}
