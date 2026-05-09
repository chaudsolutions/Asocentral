import { Request, Response } from "express";
import PersonalityModel from "../models/personality.model";
import { BadRequestError } from "../errors/httpError";
import { UserModel } from "../models/user.model";
import { deleteFromS3ByUrl } from "../utils/s3-upload";

const ensureAdmin = async (userId?: string) => {
    const admin = await UserModel.findById(userId);
    if (!admin || admin.role !== "admin") {
        throw new BadRequestError("User not found or not authorized");
    }
};

export const personalityController = {
    getPersonalities: async (req: Request, res: Response) => {
        try {
            const personalities = await PersonalityModel.find({
                isActive: true,
            }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                personalities,
            });
        } catch (error) {
            console.error("Error fetching personalities:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching personalities",
            });
        }
    },

    getSinglePersonality: async (req: Request, res: Response) => {
        try {
            const { personalityId } = req.params;
            const personality = await PersonalityModel.findById(personalityId);

            if (!personality || !personality.isActive) {
                res.status(404).json({
                    success: false,
                    message: "Personality not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                personality,
            });
        } catch (error) {
            console.error("Error fetching personality:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching personality",
            });
        }
    },

    adminGetPersonalities: async (req: Request, res: Response) => {
        try {
            await ensureAdmin(req.userId);

            const personalities = await PersonalityModel.find().sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                personalities,
            });
        } catch (error) {
            console.error("Error fetching personalities:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while fetching personalities",
            });
        }
    },

    createPersonality: async (req: Request, res: Response) => {
        try {
            await ensureAdmin(req.userId);

            const {
                title,
                description,
                image,
                isActive = true,
                website,
                socialLinks,
            } = req.body;

            if (!title?.trim() || !description?.trim() || !image?.trim()) {
                throw new BadRequestError(
                    "Title, description and image are required",
                );
            }

            const personality = await PersonalityModel.create({
                title: title.trim(),
                description: description.trim(),
                image: image.trim(),
                website: website?.trim() || "",
                socialLinks: {
                    twitter: socialLinks?.twitter?.trim() || "",
                    facebook: socialLinks?.facebook?.trim() || "",
                    instagram: socialLinks?.instagram?.trim() || "",
                    linkedin: socialLinks?.linkedin?.trim() || "",
                    youtube: socialLinks?.youtube?.trim() || "",
                },
                isActive,
            });

            res.status(201).json({
                success: true,
                message: "Personality of the week created",
                personality,
            });
        } catch (error) {
            console.error("Error creating personality:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while creating personality",
            });
        }
    },

    updatePersonality: async (req: Request, res: Response) => {
        try {
            await ensureAdmin(req.userId);
            const { personalityId } = req.params;
            const {
                title,
                description,
                image,
                isActive = true,
                website,
                socialLinks,
            } = req.body;

            if (!title?.trim() || !description?.trim() || !image?.trim()) {
                throw new BadRequestError(
                    "Title, description and image are required",
                );
            }

            const existing = await PersonalityModel.findById(personalityId);
            if (!existing) {
                throw new BadRequestError("Personality not found");
            }

            if (existing.image && existing.image !== image.trim()) {
                await deleteFromS3ByUrl(existing.image).catch((error) => {
                    console.error("Error deleting old personality image:", error);
                });
            }

            const personality = await PersonalityModel.findByIdAndUpdate(
                personalityId,
                {
                    title: title.trim(),
                    description: description.trim(),
                    image: image.trim(),
                    website: website?.trim() || "",
                    socialLinks: {
                        twitter: socialLinks?.twitter?.trim() || "",
                        facebook: socialLinks?.facebook?.trim() || "",
                        instagram: socialLinks?.instagram?.trim() || "",
                        linkedin: socialLinks?.linkedin?.trim() || "",
                        youtube: socialLinks?.youtube?.trim() || "",
                    },
                    isActive,
                },
                { new: true },
            );

            res.status(200).json({
                success: true,
                message: "Personality updated successfully",
                personality,
            });
        } catch (error) {
            console.error("Error updating personality:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while updating personality",
            });
        }
    },

    deletePersonality: async (req: Request, res: Response) => {
        try {
            await ensureAdmin(req.userId);
            const { personalityId } = req.params;
            const personality = await PersonalityModel.findByIdAndDelete(
                personalityId,
            );

            if (!personality) {
                throw new BadRequestError("Personality not found");
            }

            if (personality.image) {
                await deleteFromS3ByUrl(personality.image).catch((error) => {
                    console.error("Error deleting personality image:", error);
                });
            }

            res.status(200).json({
                success: true,
                message: "Personality deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting personality:", error);
            if (error instanceof BadRequestError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Internal server error while deleting personality",
            });
        }
    },
};
