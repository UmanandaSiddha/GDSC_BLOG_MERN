import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    post: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        post: [{
            type: mongoose.Schema.ObjectId,
            ref: "Blog",
            default: []
        }],
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;