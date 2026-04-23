import { Document, model, Schema } from "mongoose";

// interface for category document
export interface ICategory extends Document {
    name: string;
    description: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

// category schema definition
const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
