import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema: Schema<ILike> = new mongoose.Schema(
    {
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

const Like = mongoose.model<ILike>("Like", likeSchema);
export default Like;