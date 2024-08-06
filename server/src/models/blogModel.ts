import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    content: string;
    image: string;
    likes: number;
    comments: number;
    views: number;
    isPrivate: boolean;
    category?: mongoose.Schema.Types.ObjectId;
    disableComments: boolean;
    blogImages: string[];
    author: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema: Schema<IBlog> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: false,
        },
        isPrivate: {
            type: Boolean,
            default: true,
        },
        disableComments: {
            type: Boolean,
            default: false,
        },
        likes: {
            type: Number,
            default: 0,
        },
        comments: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        blogImages: {
            type: [String],
            required: true,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;