import { Request, Response } from "express";
import axios from "axios";
import { NEWS_DATA_API_KEY, NEWS_DATA_API_URL } from "../utils/constants";
import { CategoryModel } from "../models/category.model";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import NewsModel, { INews } from "../models/news.model";

// Cache variables stored in memory (server-side)
let cachedNewsData: INews[] = [];
let lastFetchTime: number | null = null;

// 6 hours in milliseconds
const CACHE_DURATION = 6 * 60 * 60 * 1000;

export const apiController = {
    getNewsFromNewsDataIo: async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const now = Date.now();
            let apiNews: INews[] = [];

            // 1. Handle NewsData.io (Cached Logic)
            if (
                cachedNewsData &&
                lastFetchTime &&
                now - lastFetchTime < CACHE_DURATION
            ) {
                console.log("Serving NewsData.io results from cache...");
                apiNews = cachedNewsData;
            } else {
                console.log(
                    "NewsData.io cache expired. Fetching fresh from API...",
                );
                try {
                    const response = await axios.get(NEWS_DATA_API_URL, {
                        params: {
                            apikey: NEWS_DATA_API_KEY,
                            language: "en",
                            removeduplicate: 1,
                        },
                    });

                    if (response.data.status === "success") {
                        cachedNewsData = response.data.results;
                        lastFetchTime = now;
                        apiNews = cachedNewsData;
                    }
                } catch (apiError) {
                    console.error("NewsData.io API Call Failed:", apiError);
                    // Fallback to stale cache if the API is down
                    apiNews = cachedNewsData || [];
                }
            }

            // 2. Handle MongoDB (Always Fresh Logic)
            // We fetch this every time without checking lastFetchTime
            const systemNews = await NewsModel.find()
                .sort({ createdAt: -1 }) // Get newest system news first
                .lean();

            // 3. Merge and Return
            // Spread systemNews first if you want your local news to appear at the top
            const mergedNews = [...systemNews, ...apiNews];

            res.status(200).json({
                success: true,
                newsData: mergedNews,
                totalResults: mergedNews.length,
                cacheUpdated:
                    apiNews === cachedNewsData && lastFetchTime === now,
            });
        } catch (error) {
            console.error("General News Fetch Error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to load news data",
            });
        }
    },

    // get news data news by url
    getNewsByUrl: async (req: Request, res: Response): Promise<void> => {
        try {
            const { url } = req.params;
            const response = await axios.get(url);
            const dom = new JSDOM(response.data, { url });
            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            res.status(200).json({
                success: true,
                newsData: article?.textContent || "",
            });
        } catch (error) {
            console.error("Error fetching news data:", error);
            res.status(500).json({
                success: false,
                message: "Failed to load front-page news",
            });
        }
    },

    getCategories: async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await CategoryModel.find().lean();

            res.status(200).json({
                success: true,
                categories,
            });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({
                success: false,
                message: "Failed to load categories",
            });
        }
    },
};
