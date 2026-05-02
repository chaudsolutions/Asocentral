import mongoose, { Schema, Document, Types } from "mongoose";
import { INewsContent } from "./news.model";

export interface IUnpublishedNews extends Document {
    article_id: string;
    title: string;
    category: string[];
    content: INewsContent[];
    country: string[];
    creator: Types.ObjectId[];
    author: Types.ObjectId;
    description: string;
    image_url: string;
    keywords: string[];
    language: string;
    link: string;
    pubDate: string;
    video_url: string | null;
    posted: boolean;
    postedAt?: Date;
    active: boolean;
}

const NewsContentSchema = new Schema<INewsContent>(
    {
        image_url: { type: String },
        title: { type: String },
        description: { type: String, required: true },
    },
    { _id: false },
);

const UnpublishedNewsSchema: Schema = new Schema<IUnpublishedNews>(
    {
        article_id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        title: { type: String, required: true },
        category: { type: [String], default: [], index: true },
        content: { type: [NewsContentSchema], default: [] },
        country: { type: [String], default: [] },
        creator: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        description: { type: String, default: "" },
        image_url: { type: String, required: true },
        keywords: { type: [String], default: [] },
        language: { type: String, default: "en" },
        link: { type: String },
        pubDate: { type: String, required: true },
        video_url: { type: String, default: null },
        posted: { type: Boolean, default: false },
        postedAt: { type: Date },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
);

const UnpublishedNewsModel =
    mongoose.models.UnpublishedNews ||
    mongoose.model<IUnpublishedNews>("UnpublishedNews", UnpublishedNewsSchema);

export default UnpublishedNewsModel;
