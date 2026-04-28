import { Request, Response } from "express";
import crypto from "node:crypto";
import { BadRequestError } from "../errors/httpError";
import { UserModel } from "../models/user.model";
import { CategoryModel } from "../models/category.model";
import NewsModel from "../models/news.model";

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

            const users = await UserModel.find().select("-password");

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
};
