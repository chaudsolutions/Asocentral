import { Request, Response } from "express";
import crypto from "node:crypto";
import { BadRequestError, UnauthorizedError } from "../errors/httpError";
import { UserModel } from "../models/user.model";
import UnpublishedNewsModel from "../models/unpublished-news.model";
import NewsModel from "../models/news.model";
import AppSettingsModel from "../models/app-settings.model";
import { hashPassword, validatePassword } from "../utils/tools";
import { NotificationCategory } from "../models/notification.model";
import { createNotificationWithEmail } from "../utils/notification";

interface NewsContent {
    image_url: string;
    title: string;
    description: string;
}

interface UserNewsRequest extends Request {
    body: {
        title: string;
        description: string;
        content: NewsContent[];
        category: string[];
        country: string[];
        image_url: string;
        keywords: string[];
        link: string;
        pubDate: string;
        video_url: string | null;
    };
    params: {
        newsId: string;
    };
}

interface KycRequest extends Request {
    body: {
        firstName: string;
        lastName: string;
        address: string;
        city?: string;
        state: string;
        country: string;
        occupation: string;
        age: number;
        zip?: string;
        idCardImage?: string;
        idCardBackImage?: string;
    };
}

const getWebsiteUrl = async () => {
    const settings = await AppSettingsModel.findOne({ key: "main" })
        .select("general.websiteUrl")
        .lean();
    return settings?.general?.websiteUrl || "N/A";
};

export const userController = {
    getUserData: async (req: Request, res: Response) => {
        try {
            const user = await UserModel.findById(req.userId).select(
                "-password",
            );

            if (!user) {
                throw new BadRequestError("User not found");
            }

            res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching user data",
            });
        }
    },

    getDashboardData: async (req: Request, res: Response) => {
        try {
            const user = await UserModel.findById(req.userId).select(
                "-password",
            );

            if (!user) {
                throw new BadRequestError("User not found");
            }

            const [
                unpublishedNews,
                publishedNews,
                topDownloadedNews,
                topSharedNews,
                topViewedNews,
                topCommentedNews,
            ] = await Promise.all([
                UnpublishedNewsModel.countDocuments({
                    author: req.userId,
                    posted: false,
                }),
                NewsModel.countDocuments({ creator: req.userId }),
                NewsModel.find({ creator: req.userId })
                    .sort({ downloads: -1 })
                    .limit(5)
                    .select("title downloads"),
                NewsModel.find({ creator: req.userId })
                    .sort({ shares: -1 })
                    .limit(5)
                    .select("title shares"),
                NewsModel.find({ creator: req.userId })
                    .sort({ views: -1 })
                    .limit(5)
                    .select("title views"),
                NewsModel.aggregate([
                    { $match: { creator: user._id } },
                    {
                        $addFields: {
                            commentsCount: {
                                $size: { $ifNull: ["$comments", []] },
                            },
                        },
                    },
                    { $sort: { commentsCount: -1 } },
                    { $limit: 5 },
                    { $project: { title: 1, commentsCount: 1 } },
                ]),
            ]);

            res.status(200).json({
                success: true,
                stats: {
                    publishedNews,
                    unpublishedNews,
                },
                charts: {
                    topDownloadedNews,
                    topSharedNews,
                    topViewedNews,
                    topCommentedNews,
                },
            });
        } catch (error) {
            console.error("Error fetching user dashboard:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while fetching dashboard",
                });
            }
        }
    },

    updateUserData: async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body;

            if (!name?.trim() || !email?.trim()) {
                throw new BadRequestError("Name and email are required");
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await UserModel.findOne({
                email: normalizedEmail,
                _id: { $ne: req.userId },
            });

            if (existingUser) {
                throw new BadRequestError(
                    "User with this email already exists",
                );
            }

            const user = await UserModel.findByIdAndUpdate(
                req.userId,
                { name: name.trim(), email: normalizedEmail },
                { new: true },
            ).select("-password");

            if (!user) {
                throw new BadRequestError("User not found");
            }
            const websiteUrl = await getWebsiteUrl();

            const admins = await UserModel.find({ role: "admin" }).select(
                "_id",
            );
            await Promise.all(
                admins.map((admin) =>
                    createNotificationWithEmail({
                        recipient: admin._id,
                        category: NotificationCategory.KYC_COMPLETED,
                        title: "Journalist KYC completed",
                        message: `${user.name} has completed KYC verification.`,
                        entityType: "user",
                        entityId: String(user._id),
                        emailSubject: "KYC Completed",
                        emailHeading: "KYC Completed",
                        emailBody: `${user.name} completed KYC and is now eligible to submit news.`,
                        ctaLabel: "Review User",
                        ctaLink: `${websiteUrl}/admin/users`,
                    }),
                ),
            );

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user,
            });
        } catch (error) {
            console.error("Error updating user data:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while updating profile",
                });
            }
        }
    },

    updateKyc: async (req: KycRequest, res: Response) => {
        try {
            const {
                firstName,
                lastName,
                address,
                city,
                state,
                country,
                occupation,
                age,
                zip,
                idCardImage,
                idCardBackImage,
            } = req.body;

            if (
                !firstName?.trim() ||
                !lastName?.trim() ||
                !address?.trim() ||
                !state?.trim() ||
                !country?.trim() ||
                !occupation?.trim() ||
                !age
            ) {
                throw new BadRequestError("Complete KYC details are required");
            }

            const user = await UserModel.findByIdAndUpdate(
                req.userId,
                {
                    kycStatus: true,
                    kycDetails: {
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        address: address.trim(),
                        city: city?.trim(),
                        state: state.trim(),
                        country: country.trim(),
                        occupation: occupation.trim(),
                        age,
                        zip: zip?.trim(),
                        idCardImage,
                        idCardBackImage,
                    },
                },
                { new: true },
            ).select("-password");

            if (!user) {
                throw new BadRequestError("User not found");
            }

            res.status(200).json({
                success: true,
                message: "KYC details updated successfully",
                user,
            });
        } catch (error) {
            console.error("Error updating KYC:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while updating KYC",
                });
            }
        }
    },

    changePassword: async (req: Request, res: Response) => {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword || newPassword.length < 6) {
                throw new BadRequestError(
                    "Current password and a new password of at least 6 characters are required",
                );
            }

            const user = await UserModel.findById(req.userId);
            if (!user) {
                throw new BadRequestError("User not found");
            }

            const isPasswordValid = validatePassword(
                currentPassword,
                user.password,
            );
            if (!isPasswordValid) {
                throw new UnauthorizedError("Current password is incorrect");
            }

            user.password = hashPassword(newPassword);
            await user.save();

            res.status(200).json({
                success: true,
                message: "Password changed successfully",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            if (error instanceof UnauthorizedError) {
                res.status(401).json({
                    success: false,
                    message: error.message,
                });
            } else if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while changing password",
                });
            }
        }
    },

    getMyNews: async (req: Request, res: Response) => {
        try {
            const news = await UnpublishedNewsModel.find({
                author: req.userId,
            }).sort({ createdAt: -1 });

            res.status(200).json({ success: true, news });
        } catch (error) {
            console.error("Error fetching user news:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching news",
            });
        }
    },

    createNews: async (req: UserNewsRequest, res: Response) => {
        try {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                throw new BadRequestError("User not found");
            }

            if (!user.kycStatus) {
                throw new BadRequestError(
                    "Complete your KYC before posting news",
                );
            }

            const articleId = crypto.randomBytes(16).toString("hex");

            const news = await UnpublishedNewsModel.create({
                ...req.body,
                article_id: articleId,
                creator: [user._id],
                author: user._id,
                posted: false,
            });
            const websiteUrl = await getWebsiteUrl();

            const admins = await UserModel.find({ role: "admin" }).select(
                "_id",
            );
            await Promise.all(
                admins.map((admin) =>
                    createNotificationWithEmail({
                        recipient: admin._id,
                        category: NotificationCategory.NEWS_SUBMITTED,
                        title: "New unpublished news submitted",
                        message: `${user.name} submitted "${news.title}" for review.`,
                        entityType: "news",
                        entityId: String(news._id),
                        emailSubject: "New News Submission",
                        emailHeading: "New News Submission",
                        emailBody: `${user.name} submitted a new unpublished news article titled "${news.title}".`,
                        ctaLabel: "Review Submission",
                        ctaLink: `${websiteUrl}/admin/users`,
                    }),
                ),
            );

            res.status(201).json({
                success: true,
                message: "News submitted for admin review",
                news,
            });
        } catch (error) {
            console.error("Error creating user news:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while creating news",
                });
            }
        }
    },
};
