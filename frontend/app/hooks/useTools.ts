import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { format } from "date-fns";
import { localStorageToken } from "../utils/constants";

export const getUserToken = () => {
    const token = localStorage.getItem(localStorageToken) as string;

    return { token: JSON.parse(token) };
};

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export const formatDate = (dateString: Date | string | undefined) => {
    return format(new Date(dateString || ""), "MMM dd, yyyy");
};

export const useResponsive = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isTab = useMediaQuery(theme.breakpoints.down("lg"));

    return { isMobile, isTab };
};

export function formatUSDCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNGNCurrency(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

export const generateSlug = (text: string): string => {
    return (
        text
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, "-")
            .replace(/^-+|-+$/g, "") +
        `-${Math.random().toString(36).slice(2, 7)}`
    );
};

export const generateRandomName = (text: string): string => {
    const characters =
        new Date().getTime().toString() +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let name = text + "-";
    for (let i = 0; i < 10; i++) {
        name += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return name;
};
