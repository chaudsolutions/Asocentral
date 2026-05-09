import mongoose, { Schema, Document, Types } from "mongoose";

// Sub-interface for the content array items
export interface INewsContent {
    image_url: string;
    title: string;
    description: string;
}

export interface IComment {
    commentId: string;
    sessionId: string;
    name: string;
    user: string;
    content: string;
    createdAt: Date;
}

// Main interface for the News document
export interface INews extends Document {
    article_id: string;
    title: string;
    category: string[];
    content: INewsContent[];
    country: string[];
    creator: Types.ObjectId[];
    description: string;
    image_url: string;
    keywords: string[];
    language: string;
    link: string;
    pubDate: string;
    video_url: string | null;
    isSystem: boolean;
    active: boolean;
    views: number;
    shares: number;
    downloads: number;
    comments: IComment[];
}

// Define the sub-schema first
const NewsContentSchema = new Schema<INewsContent>(
    {
        image_url: { type: String },
        title: { type: String },
        description: { type: String, required: true },
    },
    { _id: false },
); // Disable _id for sub-documents to keep it clean

const CommentSchema = new Schema<IComment>(
    {
        commentId: { type: String, required: true },
        sessionId: { type: String, required: true },
        name: { type: String, default: "Anonymous Reader" },
        user: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false },
);

// Define the main schema
const NewsSchema: Schema = new Schema<INews>(
    {
        article_id: {
            type: String,
            required: true,
            unique: true,
            index: true, // Indexing for faster lookups
        },
        title: { type: String, required: true },
        category: {
            type: [String],
            default: [],
            index: true, // Critical for your Category page filtering
        },
        content: {
            type: [NewsContentSchema],
            default: [],
        },
        country: { type: [String], default: [] },
        creator: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        description: { type: String, default: "" },
        image_url: { type: String, required: true },
        keywords: { type: [String], default: [] },
        language: { type: String, default: "en" },
        link: { type: String },
        pubDate: { type: String, required: true },
        video_url: { type: String, default: null },
        isSystem: { type: Boolean, default: true },
        active: { type: Boolean, default: true },
        views: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        comments: {
            type: [CommentSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

// Export the model
const NewsModel =
    mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default NewsModel;
