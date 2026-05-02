import { Request, Response } from "express";
import crypto from "node:crypto";
import { BadRequestError } from "../errors/httpError";
import { UserModel, UserRole } from "../models/user.model";
import { CategoryModel } from "../models/category.model";
import NewsModel from "../models/news.model";
import UnpublishedNewsModel from "../models/unpublished-news.model";
import { hashPassword } from "../utils/tools";

interface CategoryRequestBody extends Request {
    body: {
        categoryName: string;
        categoryDescription: string;
        slug: string;
    };
    params: {
        categoryId: string;
    };
}

interface NewsContent {
    image_url: string;
    title: string;
    description: string;
}

interface NewsCreateRequestBody extends Request {
    body: {
        title: string;
        description: string;
        content: NewsContent[];
        category: string[];
        country: string[];
        creator: string[];
        image_url: string;
        keywords: string[];
        link: string;
        pubDate: string;
        video_url: string | null;
        isActive: boolean;
    };
    params: {
        newsId: string;
    };
}

interface UserRequestBody extends Request {
    body: {
        name: string;
        email: string;
        password?: string;
        role: UserRole;
    };
    params: {
        userId: string;
    };
}

export const adminController = {
    // function to get admin data
    getAdminData: async (req: Request, res: Response) => {
        try {
            const userId = req.userId;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            res.status(200).json({
                admin: user,
            });
        } catch (error) {
            console.error("Error fetching admin data:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching admin data",
            });
        }
    },

    // function to get admin dashboard summary and charts
    getDashboardData: async (req: Request, res: Response) => {
        try {
            const userId = req.userId;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const [
                totalUsers,
                usersWithNews,
                publishedNews,
                unpublishedNews,
                activeNews,
                inactiveNews,
                topDownloadedNews,
                topSharedNews,
                topViewedNews,
                topCommentedNews,
                topJournalists,
            ] = await Promise.all([
                UserModel.countDocuments({ role: "user" }),
                UnpublishedNewsModel.distinct("author").then(
                    (authors) => authors.length,
                ),
                NewsModel.countDocuments({}),
                UnpublishedNewsModel.countDocuments({ posted: false }),
                NewsModel.countDocuments({ active: true }),
                NewsModel.countDocuments({ active: false }),
                NewsModel.find({})
                    .sort({ downloads: -1 })
                    .limit(5)
                    .select("title downloads"),
                NewsModel.find({})
                    .sort({ shares: -1 })
                    .limit(5)
                    .select("title shares"),
                NewsModel.find({})
                    .sort({ views: -1 })
                    .limit(5)
                    .select("title views"),
                NewsModel.aggregate([
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
                UnpublishedNewsModel.aggregate([
                    {
                        $group: {
                            _id: "$author",
                            submissions: { $sum: 1 },
                            posted: {
                                $sum: {
                                    $cond: [{ $eq: ["$posted", true] }, 1, 0],
                                },
                            },
                        },
                    },
                    { $sort: { submissions: -1 } },
                    { $limit: 5 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    {
                        $project: {
                            name: "$user.name",
                            submissions: 1,
                            posted: 1,
                        },
                    },
                ]),
            ]);

            res.status(200).json({
                success: true,
                stats: {
                    totalUsers,
                    usersWithNews,
                    publishedNews,
                    unpublishedNews,
                    activeNews,
                    inactiveNews,
                },
                charts: {
                    topDownloadedNews,
                    topSharedNews,
                    topViewedNews,
                    topCommentedNews,
                    topJournalists,
                },
            });
        } catch (error) {
            console.error("Error fetching admin dashboard:", error);
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

    // function for admin to create a news category
    createCategory: async (req: CategoryRequestBody, res: Response) => {
        try {
            const userId = req.userId;
            const { categoryName, categoryDescription, slug } = req.body;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            await CategoryModel.create({
                name: categoryName,
                description: categoryDescription,
                slug,
            });

            res.status(201).json({
                success: true,
                message: "Category created successfully",
            });
        } catch (error) {
            console.error("Error creating category:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while creating category",
                });
            }
        }
    },

    // function to update a category
    updateCategory: async (req: CategoryRequestBody, res: Response) => {
        try {
            const userId = req.userId;
            const { categoryId } = req.params;
            const { categoryName, categoryDescription, slug } = req.body;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const category = await CategoryModel.findOneAndUpdate(
                { _id: categoryId },
                { name: categoryName, description: categoryDescription, slug },
                { new: true },
            );

            if (!category) {
                throw new BadRequestError("Category not found");
            }

            res.status(200).json({
                success: true,
                message: "Category updated successfully",
            });
        } catch (error) {
            console.error("Error updating category:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while updating category",
                });
            }
        }
    },

    // function to delete a category
    deleteCategory: async (req: Request, res: Response) => {
        try {
            const userId = req.userId;
            const { categoryId } = req.params;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const category = await CategoryModel.findOneAndDelete({
                _id: categoryId,
            });

            if (!category) {
                throw new BadRequestError("Category not found");
            }

            res.status(200).json({
                success: true,
                message: "Category deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while deleting category",
                });
            }
        }
    },

    // function for admin to create a news article
    createNews: async (req: NewsCreateRequestBody, res: Response) => {
        try {
            const userId = req.userId;
            const {
                title,
                description,
                content,
                category,
                country,
                creator,
                image_url,
                keywords,
                link,
                pubDate,
                video_url,
            } = req.body;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            // generate article id with node crypto
            const articleId = crypto.randomBytes(16).toString("hex");

            await NewsModel.create({
                article_id: articleId,
                title,
                description,
                content,
                category,
                country,
                creator,
                image_url,
                keywords,
                link,
                pubDate,
                video_url,
            });

            res.status(201).json({
                success: true,
                message: "News created successfully",
            });
        } catch (error) {
            console.error("Error creating news:", error);
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

    // function to update a news article
    updateNews: async (req: NewsCreateRequestBody, res: Response) => {
        try {
            const userId = req.userId;
            const { newsId } = req.params;
            const {
                title,
                description,
                content,
                category,
                country,
                creator,
                image_url,
                keywords,
                link,
                pubDate,
                video_url,
            } = req.body;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const news = await NewsModel.findOneAndUpdate(
                { _id: newsId },
                {
                    title,
                    description,
                    content,
                    category,
                    country,
                    creator,
                    image_url,
                    keywords,
                    link,
                    pubDate,
                    video_url,
                },
                { new: true },
            );

            if (!news) {
                throw new BadRequestError("News not found");
            }

            res.status(200).json({
                success: true,
                message: "News updated successfully",
            });
        } catch (error) {
            console.error("Error updating news:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while updating news",
                });
            }
        }
    },

    // update news active status
    updateNewsStatus: async (req: NewsCreateRequestBody, res: Response) => {
        try {
            const userId = req.userId;
            const { newsId } = req.params;
            const { isActive } = req.body;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const news = await NewsModel.findOneAndUpdate(
                { _id: newsId },
                { active: isActive },
                { returnDocument: "after" },
            );

            if (!news) {
                throw new BadRequestError("News not found");
            }

            res.status(200).json({
                success: true,
                message: "News status updated successfully",
            });
        } catch (error) {
            console.error("Error updating news status:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while updating news status",
                });
            }
        }
    },

    // function to delete a news article
    deleteNews: async (req: Request, res: Response) => {
        try {
            const userId = req.userId;
            const { newsId } = req.params;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const news = await NewsModel.findOneAndDelete({ _id: newsId });

            if (!news) {
                throw new BadRequestError("News not found");
            }

            res.status(200).json({
                success: true,
                message: "News deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting news:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while deleting news",
                });
            }
        }
    },

    // function to get all users (for admin)
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const userId = req.userId;

            const user = await UserModel.findById(userId);
            if (!user || user.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const users = await UserModel.aggregate([
                { $project: { password: 0 } },
                {
                    $lookup: {
                        from: "unpublishednews",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$author", "$$userId"] },
                                    posted: false,
                                },
                            },
                            { $count: "count" },
                        ],
                        as: "pendingNews",
                    },
                },
                {
                    $addFields: {
                        pendingUnpublishedNews: {
                            $ifNull: [
                                { $arrayElemAt: ["$pendingNews.count", 0] },
                                0,
                            ],
                        },
                    },
                },
                { $project: { pendingNews: 0 } },
                { $sort: { createdAt: -1 } },
            ]);

            res.status(200).json({
                users,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while fetching users",
                });
            }
        }
    },

    // function for admin to create a user
    createUser: async (req: UserRequestBody, res: Response) => {
        try {
            const adminId = req.userId;
            const { name, email, password, role } = req.body;

            const admin = await UserModel.findById(adminId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            if (!name?.trim() || !email?.trim() || !password || !role) {
                throw new BadRequestError(
                    "Name, email, password, and role are required",
                );
            }

            if (password.length < 6) {
                throw new BadRequestError(
                    "Password must be at least 6 characters",
                );
            }

            if (!Object.values(UserRole).includes(role)) {
                throw new BadRequestError("Invalid user role");
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await UserModel.findOne({
                email: normalizedEmail,
            });

            if (existingUser) {
                throw new BadRequestError(
                    "User with this email already exists",
                );
            }

            await UserModel.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashPassword(password),
                role,
            });

            res.status(201).json({
                success: true,
                message: "User created successfully",
            });
        } catch (error) {
            console.error("Error creating user:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while creating user",
                });
            }
        }
    },

    // function for admin to update a user
    updateUser: async (req: UserRequestBody, res: Response) => {
        try {
            const adminId = req.userId;
            const { userId } = req.params;
            const { name, email, password, role } = req.body;

            const admin = await UserModel.findById(adminId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            if (!name?.trim() || !email?.trim() || !role) {
                throw new BadRequestError("Name, email, and role are required");
            }

            if (password && password.length < 6) {
                throw new BadRequestError(
                    "Password must be at least 6 characters",
                );
            }

            if (!Object.values(UserRole).includes(role)) {
                throw new BadRequestError("Invalid user role");
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await UserModel.findOne({
                email: normalizedEmail,
                _id: { $ne: userId },
            });

            if (existingUser) {
                throw new BadRequestError(
                    "User with this email already exists",
                );
            }

            const updateData: {
                name: string;
                email: string;
                role: UserRole;
                password?: string;
            } = {
                name: name.trim(),
                email: normalizedEmail,
                role,
            };

            if (password) {
                updateData.password = hashPassword(password);
            }

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                updateData,
                { new: true },
            ).select("-password");

            if (!updatedUser) {
                throw new BadRequestError("User not found");
            }

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Error updating user:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while updating user",
                });
            }
        }
    },

    // function for admin to delete a user
    deleteUser: async (req: Request, res: Response) => {
        try {
            const adminId = req.userId;
            const { userId } = req.params;

            const admin = await UserModel.findById(adminId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            if (adminId === userId) {
                throw new BadRequestError("You cannot delete your own account");
            }

            const targetUser = await UserModel.findById(userId);
            if (!targetUser) {
                throw new BadRequestError("User not found");
            }

            if (targetUser.role === "admin") {
                throw new BadRequestError("Admin users cannot be deleted");
            }

            const deletedUser = await UserModel.findOneAndDelete({
                _id: userId,
            });

            if (!deletedUser) {
                throw new BadRequestError("User not found");
            }

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error while deleting user",
                });
            }
        }
    },

    // function to get a single user with submitted news
    getUserDetails: async (req: Request, res: Response) => {
        try {
            const adminId = req.userId;
            const { userId } = req.params;

            const admin = await UserModel.findById(adminId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const user = await UserModel.findById(userId).select("-password");
            if (!user) {
                throw new BadRequestError("User not found");
            }

            const unpublishedNews = await UnpublishedNewsModel.find({
                author: userId,
            }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                user,
                unpublishedNews,
            });
        } catch (error) {
            console.error("Error fetching user details:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message:
                        "Internal server error while fetching user details",
                });
            }
        }
    },

    // function to update a user's submitted unpublished news
    updateUnpublishedNews: async (
        req: NewsCreateRequestBody,
        res: Response,
    ) => {
        try {
            const adminId = req.userId;
            const { newsId } = req.params;

            const admin = await UserModel.findById(adminId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const news = await UnpublishedNewsModel.findOneAndUpdate(
                { _id: newsId },
                req.body,
                { new: true },
            );

            if (!news) {
                throw new BadRequestError("Submitted news not found");
            }

            res.status(200).json({
                success: true,
                message: "Submitted news updated successfully",
                news,
            });
        } catch (error) {
            console.error("Error updating submitted news:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message:
                        "Internal server error while updating submitted news",
                });
            }
        }
    },

    // function to publish a user's submitted news into the standard news feed
    publishUnpublishedNews: async (req: Request, res: Response) => {
        try {
            const adminId = req.userId;
            const { newsId } = req.params;

            const admin = await UserModel.findById(adminId);
            if (!admin || admin.role !== "admin") {
                throw new BadRequestError("User not found or not authorized");
            }

            const unpublishedNews = await UnpublishedNewsModel.findById(newsId);
            if (!unpublishedNews) {
                throw new BadRequestError("Submitted news not found");
            }

            if (unpublishedNews.posted) {
                throw new BadRequestError(
                    "Submitted news has already been posted",
                );
            }

            await NewsModel.create({
                article_id: unpublishedNews.article_id,
                title: unpublishedNews.title,
                description: unpublishedNews.description,
                content: unpublishedNews.content,
                category: unpublishedNews.category,
                country: unpublishedNews.country,
                creator: unpublishedNews.creator,
                image_url: unpublishedNews.image_url,
                keywords: unpublishedNews.keywords,
                link: unpublishedNews.link,
                pubDate: unpublishedNews.pubDate,
                video_url: unpublishedNews.video_url,
                active: true,
            });

            unpublishedNews.posted = true;
            unpublishedNews.postedAt = new Date();
            await unpublishedNews.save();

            res.status(200).json({
                success: true,
                message: "Submitted news posted successfully",
            });
        } catch (error) {
            console.error("Error posting submitted news:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message:
                        "Internal server error while posting submitted news",
                });
            }
        }
    },
};
