import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import Comment from "../models/commentModel.js";
import Blog from "../models/blogModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createComment = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) {
        return next(new ErrorHandler("Please provide a comment", 400));
    }

    const post = await Blog.findById(id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    if (post.disableComments) {
        return next(new ErrorHandler("Comments are disabled for this post", 403));
    }

    const newComment = await Comment.create({
        comment,
        user: user._id,
        post: id
    });

    await Blog.findByIdAndUpdate(
        post._id,
        { $inc: { comments: 1 } },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        comment: newComment
    });
});

export const getPostComments = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const post = await Blog.findById(req.params.id);
    if (!post) {
        return next(new ErrorHandler("Post not found", 404)); 
    }

    let comments = await Comment.find({ post: post._id }).populate("user", "name avatar").sort({ $natural: -1 });

    if (post.disableComments && comments.length > 0) {
        comments = [];
    }

    res.status(200).json({
        success: true,
        comments
    });
});

export const getAllComments = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 10;
    const count = await Comment.countDocuments();

    const apiFeatures = new ApiFeatures(Comment.find().populate("user", "name avatar").sort({ $natural: -1 }), req.query);

    let filteredComments = await apiFeatures.query;
    let filteredComment = filteredComments.length;

    apiFeatures.pagination(resultPerPage);
    filteredComments = await apiFeatures.query.clone();

    res.status(200).json({
        success: true,
        comments: filteredComments,
        count,
        resultPerPage,
        filteredComment
    });
});

export const updateComment = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return next(new ErrorHandler("Comment not found", 404)); 
    }

    if (comment.user !== req.user?.id) {
        return next(new ErrorHandler("You are not authorized to delete this comment", 403));
    }

    const { newComment } = req.body;
    if (!newComment) {
        return next(new ErrorHandler("Please provide a comment", 400));
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        comment._id,
        { comment: newComment },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        comment: updatedComment
    });
});

export const deleteComment = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return next(new ErrorHandler("Comment not found", 404)); 
    }

    if (req.user?.role !== "admin" && comment.user !== req.user?.id) {
        return next(new ErrorHandler("You are not authorized to delete this comment", 403));
    }

    await Comment.findByIdAndDelete(comment._id);

    await Blog.findByIdAndUpdate(
        comment.post,
        { $inc: { comments: -1 } },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Comment Deleted"
    });
});