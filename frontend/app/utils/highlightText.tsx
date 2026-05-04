import type { RangeTuple } from "fuse.js";

export const highlightText = (
    text: string,
    matches: readonly RangeTuple[] = [],
) => {
    if (!matches.length) return text;

    const parts = [];
    let lastIndex = 0;

    matches.forEach(([start, end], i) => {
        if (lastIndex < start) {
            parts.push(text.slice(lastIndex, start));
        }

        parts.push(
            <span
                key={i}
                style={{
                    backgroundColor: "yellow",
                    fontWeight: 600,
                }}>
                {text.slice(start, end + 1)}
            </span>,
        );

        lastIndex = end + 1;
    });

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};
