import { Request, Response } from "express";
import axios from "axios";
import crypto from "node:crypto";
import { NEWS_DATA_API_KEY, NEWS_DATA_API_URL } from "../utils/constants";
import { CategoryModel } from "../models/category.model";
import NewsModel, { INews } from "../models/news.model";
import AppSettingsModel from "../models/app-settings.model";
import { NotificationCategory } from "../models/notification.model";
import { createNotificationWithEmail } from "../utils/notification";
import { UserModel, UserRole } from "../models/user.model";

// Cache variables stored in memory (server-side)
let cachedNewsData: INews[] = [];
let lastFetchTime: number | null = null;

// 6 hours in milliseconds
const CACHE_DURATION = 6 * 60 * 60 * 1000;

const getWebsiteUrl = async () => {
    const settings = await AppSettingsModel.findOne({ key: "main" })
        .select("general.websiteUrl")
        .lean();
    return settings?.general?.websiteUrl || "N/A";
};

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

    getSingleNews: async (req: Request, res: Response): Promise<void> => {
        try {
            const { articleId } = req.params;
            const news = await NewsModel.findOne({
                article_id: articleId,
            }).lean();

            if (!news) {
                throw new Error("News not found");
            }

            res.status(200).json({
                success: true,
                newsData: news,
            });
        } catch (error) {
            console.error("Error fetching single news:", error);
            res.status(404).json({
                success: false,
                message: "News not found",
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

    updateNewsMetrics: async (req: Request, res: Response): Promise<void> => {
        try {
            const { newsId } = req.params;
            const { field } = req.body as {
                field: "views" | "shares" | "downloads";
            };

            if (!["views", "shares", "downloads"].includes(field)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid metric field",
                });
                return;
            }

            await NewsModel.updateOne(
                { _id: newsId },
                { $inc: { [field]: 1 } },
            );

            res.status(200).json({
                success: true,
                message: "Metric updated successfully",
            });
        } catch (error) {
            console.error("Error updating news metric:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update news metric",
            });
        }
    },

    addNewsComment: async (req: Request, res: Response): Promise<void> => {
        try {
            const { newsId } = req.params;
            const { name, content, sessionId } = req.body as {
                name?: string;
                content?: string;
                sessionId?: string;
            };

            if (!content?.trim() || !sessionId?.trim()) {
                res.status(400).json({
                    success: false,
                    message: "Comment and browser session are required",
                });
                return;
            }

            const comment = {
                commentId: crypto.randomUUID(),
                sessionId: sessionId.trim(),
                name: name?.trim() || "Anonymous Reader",
                user: sessionId.trim(),
                content: content.trim(),
                createdAt: new Date(),
            };

            const news = await NewsModel.findByIdAndUpdate(
                newsId,
                { $push: { comments: comment } },
                { new: true },
            ).select("comments title creator article_id");

            if (!news) {
                res.status(404).json({
                    success: false,
                    message: "News not found",
                });
                return;
            }

            const creatorIds = (news.creator || []).map((id: unknown) =>
                String(id),
            );
            const websiteUrl = await getWebsiteUrl();
            await Promise.all(
                creatorIds.map((creatorId: string) =>
                    createNotificationWithEmail({
                        recipient: creatorId,
                        category: NotificationCategory.NEWS_COMMENTED,
                        title: "New comment on your news",
                        message: `${comment.name} commented on "${news.title}".`,
                        entityType: "news",
                        entityId: String(news._id),
                        emailSubject: "New Comment on Your News",
                        emailHeading: "Your News Got a New Comment",
                        emailBody: `${comment.name} just commented on "${news.title}".`,
                        ctaLabel: "View Comment",
                        ctaLink: `${websiteUrl}/news/${news.article_id}`,
                    }),
                ),
            );

            res.status(201).json({
                success: true,
                message: "Comment added successfully",
                comments: news.comments,
            });
        } catch (error) {
            console.error("Error adding news comment:", error);
            res.status(500).json({
                success: false,
                message: "Failed to add comment",
            });
        }
    },

    deleteNewsComment: async (req: Request, res: Response): Promise<void> => {
        try {
            const { newsId, commentId } = req.params;
            const requesterId = req.userId;

            if (!requesterId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }

            const [requester, news] = await Promise.all([
                UserModel.findById(requesterId).select("_id role"),
                NewsModel.findById(newsId),
            ]);

            if (!requester) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }

            if (!news) {
                res.status(404).json({
                    success: false,
                    message: "News not found",
                });
                return;
            }

            const isAdmin = requester.role === UserRole.ADMIN;
            const isCreator = (news.creator || []).some(
                (id: unknown) => String(id) === String(requester._id),
            );

            if (!isAdmin && !isCreator) {
                res.status(403).json({
                    success: false,
                    message:
                        "Only admins or creators of this news can delete comments",
                });
                return;
            }

            const originalLength = news.comments?.length || 0;
            news.comments = (news.comments || []).filter(
                (comment: { commentId: string }) =>
                    comment.commentId !== commentId,
            );

            if (news.comments.length === originalLength) {
                res.status(404).json({
                    success: false,
                    message: "Comment not found",
                });
                return;
            }

            await news.save();

            res.status(200).json({
                success: true,
                message: "Comment deleted successfully",
                comments: news.comments,
            });
        } catch (error) {
            console.error("Error deleting news comment:", error);
            res.status(500).json({
                success: false,
                message: "Failed to delete comment",
            });
        }
    },

    proxyImage: async (req: Request, res: Response): Promise<void> => {
        const { url } = req.query;

        if (!url || typeof url !== "string") {
            res.status(400).json({ message: "url query param required" });
            return;
        }

        // Only allow http/https URLs to prevent SSRF against internal services
        let parsed: URL;
        try {
            parsed = new URL(url);
        } catch {
            res.status(400).json({ message: "Invalid URL" });
            return;
        }
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            res.status(400).json({ message: "Only http/https URLs allowed" });
            return;
        }

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
                timeout: 15_000,
                headers: { "User-Agent": "Mozilla/5.0" },
            });

            const contentType =
                (response.headers["content-type"] as string) || "image/jpeg";

            res.set("Content-Type", contentType);
            res.set("Cache-Control", "public, max-age=86400");
            res.set("Access-Control-Allow-Origin", "*");
            res.send(Buffer.from(response.data));
        } catch {
            res.status(502).json({ message: "Failed to fetch image" });
        }
    },
};
