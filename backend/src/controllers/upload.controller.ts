import { Request, Response } from "express";
import { uploadToS3 } from "../utils/s3-upload";

type MulterRequest = Request & {
    file?: Express.Multer.File;
};

export const uploadController = {
    uploadFile: async (req: MulterRequest, res: Response): Promise<void> => {
        try {
            const file = req.file;
            const folder = typeof req.body.folder === "string" ? req.body.folder : "uploads";

            if (!file) {
                res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
                return;
            }

            const result = await uploadToS3({
                buffer: file.buffer,
                mimetype: file.mimetype,
                originalname: file.originalname,
                folder,
            });

            res.status(201).json({
                success: true,
                message: "File uploaded successfully",
                file: {
                    key: result.key,
                    url: result.url,
                    mimetype: file.mimetype,
                    size: file.size,
                    name: file.originalname,
                },
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({
                success: false,
                message: "Failed to upload file",
            });
        }
    },
};
