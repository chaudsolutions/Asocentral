export const serVer =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_API_URL
        : "http://localhost:3000/api";
export const appName = "Trojan News";
export const websiteUrl = "";
export const websiteLogo = `${websiteUrl}/logo.png`;
export const localStorageToken = "trojan-news-token";
export const adminLocalStorageToken = "trojan-news-admin-token";
