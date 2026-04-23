import axios from "axios";
import type { NewsDataType } from "~/types/news";
import { serVer } from "~/utils/constants";

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
