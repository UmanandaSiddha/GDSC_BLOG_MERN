import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    comment: string;
    user: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema: Schema<IComment> = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: "Blog",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;