export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const DB_URI = process.env.DB_URI || "";
export const SALT_ROUNDS = 10;
export const NEWS_DATA_API_KEY = process.env.NEWS_DATA_API_KEY || "";
export const NEWS_DATA_API_URL = "https://newsdata.io/api/1/latest";

// AWS S3 BUCKET CONFIG
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
