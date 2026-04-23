import { z } from "zod/v4";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().default(3000),
    NEWS_DATA_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    DB_URI: z.string(),
    SECRET_USER: z.string(),
    SECRET_PASS: z.string(),
    CLIENT_URL: z.string(),
});

try {
    envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error(
            "Missing environment variables:",
            error.issues.flatMap((issue) => issue.path),
        );
    } else {
        console.error(error);
    }
    process.exit(1);
}

export const env = envSchema.parse(process.env);
