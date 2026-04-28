import axios from "axios";
import type { NewsDataType } from "~/types/news";
import { serVer } from "~/utils/constants";
import { getUserToken } from "./useTools";

// fetch news data from api
export const fetchNewsData = async (): Promise<NewsDataType[]> => {
    try {
        const response = await axios.get(`${serVer}/app/news`);

        return response.data.newsData;
    } catch (error) {
        console.error("Error fetching news data:", error);
        throw error;
    }
};

// payload
type NewsPayload = {
    title: string;
    description: string;
    category: string[];
    image_url: string;
    video_url: string;
    link: string;
    pubDate: string;
    country: string[];
    creator: string[];
    keywords: string[];
    content: {
        title: string;
        description: string;
        image_url: string;
    }[];
};

// function to post news data to api
export const postNewsData = async (payload: NewsPayload): Promise<void> => {
    const { token } = getUserToken();
    try {
        await axios.post(`${serVer}/admin/news`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error posting news data:", error);
        throw error;
    }
};

// function to update news data to api
export const updateNewsData = async (
    newsId: string,
    payload: NewsPayload,
): Promise<void> => {
    const { token } = getUserToken();
    try {
        await axios.put(`${serVer}/admin/news/${newsId}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error updating news data:", error);
        throw error;
    }
};

// function to delete news data from api
export const deleteNewsData = async (newsId: string): Promise<void> => {
    const { token } = getUserToken();
    try {
        await axios.delete(`${serVer}/admin/news/${newsId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error deleting news data:", error);
        throw error;
    }
};

// function to update news status
export const updateNewsStatus = async (
    newsId: string,
    isActive: boolean,
): Promise<void> => {
    const { token } = getUserToken();
    try {
        await axios.patch(
            `${serVer}/admin/news/${newsId}/status`,
            { isActive },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
    } catch (error) {
        console.error("Error updating news status:", error);
        throw error;
    }
};
