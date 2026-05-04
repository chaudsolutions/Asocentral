import { useEffect, useMemo, useState } from "react";
import Fuse, { type FuseResult } from "fuse.js";
import { debounce } from "@mui/material/utils";

export const useFuzzySearch = <T>({
    data,
    keys,
    threshold = 0.3,
}: {
    data: T[];
    keys: string[];
    threshold?: number;
}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<T[]>([]);
    const [rawResults, setRawResults] = useState<FuseResult<T>[]>([]);

    const fuse = useMemo(() => {
        return new Fuse(data, {
            keys,
            threshold,
            includeMatches: true, // needed for highlighting
        });
    }, [data, keys, threshold]);

    const performSearch = useMemo(
        () =>
            debounce((q: string) => {
                if (!q.trim()) {
                    setResults([]);
                    setRawResults([]);
                    return;
                }

                const res = fuse.search(q);
                setResults(res.map((r) => r.item));
                setRawResults(res);
            }, 300),
        [fuse],
    );

    useEffect(() => {
        performSearch(query);
        return () => performSearch.clear();
    }, [query, performSearch]);

    return {
        query,
        setQuery,
        results,
        rawResults,
    };
};
