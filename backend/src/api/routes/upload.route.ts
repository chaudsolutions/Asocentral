import { Router, type RequestHandler } from "express";
import multer from "multer";
import { authenticate } from "../../middlewares/auth.middleware";
import { uploadController } from "../../controllers/upload.controller";

const uploadRoute = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});

uploadRoute.use(authenticate);
uploadRoute.post(
    "/file",
    upload.single("file") as unknown as RequestHandler,
    uploadController.uploadFile,
);

export default uploadRoute;
