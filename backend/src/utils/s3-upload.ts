import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import crypto from "node:crypto";
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET_NAME,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
} from "./constants";

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID || "",
        secretAccessKey: AWS_SECRET_ACCESS_KEY || "",
    },
});

type S3Command = PutObjectCommand | DeleteObjectCommand;

const sendS3Command = async (command: S3Command): Promise<unknown> => {
    const client = s3Client as unknown as {
        send: (command: S3Command) => Promise<unknown>;
    };
    return client.send(command);
};

const guessExtension = (mimetype: string): string => {
    if (mimetype === "image/jpeg") return ".jpg";
    if (mimetype === "image/png") return ".png";
    if (mimetype === "image/webp") return ".webp";
    if (mimetype === "image/gif") return ".gif";
    if (mimetype === "video/mp4") return ".mp4";
    if (mimetype === "video/webm") return ".webm";
    if (mimetype === "application/pdf") return ".pdf";
    return "";
};

export const uploadToS3 = async (params: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    folder?: string;
}) => {
    const { buffer, mimetype, originalname, folder = "uploads" } = params;
    const safeOriginal = originalname.replace(/\s+/g, "-").toLowerCase();
    const ext = safeOriginal.includes(".")
        ? `.${safeOriginal.split(".").pop() || ""}`
        : guessExtension(mimetype);

    const key = `${folder}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

    await sendS3Command(
        new PutObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
        }),
    );

    const url = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    return { key, url };
};

const getS3KeyFromUrl = (fileUrl: string): string | null => {
    try {
        const parsed = new URL(fileUrl);
        const expectedHost = `${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;

        if (parsed.host !== expectedHost) return null;

        const key = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
        return key || null;
    } catch {
        return null;
    }
};

export const deleteFromS3ByUrl = async (fileUrl: string): Promise<boolean> => {
    const key = getS3KeyFromUrl(fileUrl);
    if (!key) return false;

    await sendS3Command(
        new DeleteObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: key,
        }),
    );

    return true;
};
