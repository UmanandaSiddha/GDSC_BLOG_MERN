import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import Blog from "../models/blogModel.js";
import Like from "../models/likeModel.js";

export const likePost = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const post = await Blog.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    await Like.create({
        user: user._id,
        post: post._id
    });

    const newPost = await Blog.findByIdAndUpdate(
        post._id,
        { $inc: { likes: 1 } },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        blog: newPost
    });
});

export const likeDelete = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const post = await Blog.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    await Like.deleteOne({
        user: user._id,
        post: post._id
    });

    const newPost = await Blog.findByIdAndUpdate(
        post._id,
        { $inc: { likes: -1 } },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        blog: newPost 
    });
});

export const getLike = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const post = await Blog.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const like = await Like.findOne({
        user: user._id,
        post: post._id
    });

    res.status(200).json({
        success: true,
        like: like? true : false
    });
});

export const getPostLikes = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const post = await Blog.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    if (user.role === "creator" && String(post.author) !== String(user._id)) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    const likes = await Like.find({ post: post._id }).populate("user", "name avatar");

    res.status(200).json({
        success: true,
        likes,
    });
});

export const updateView = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const post = await Blog.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }
    
    const newPost = await Blog.findByIdAndUpdate(
        post._id,
        { $inc: { views: 1 } },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        blog: newPost 
    });
});