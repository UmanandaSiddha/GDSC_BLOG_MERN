import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.js";
import User, { requestEnum, roleEnum } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import Like from "../models/likeModel.js";

export const getAllUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 10;
    const count = await User.countDocuments();

    const apiFeatures = new ApiFeatures(User.find().sort({ $natural: -1 }), req.query).searchUser().filter();

    let filteredUsers = await apiFeatures.query;
    let filteredUsersCount = filteredUsers.length;

    apiFeatures.pagination(resultPerPage);
    filteredUsers = await apiFeatures.query.clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        users: filteredUsers,
        filteredUsersCount
    });
});

export const acceptCreatorRequest = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    await User.findByIdAndUpdate(
        user._id, 
        { request: requestEnum.ACCEPTED },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Creator request accepted",
    });
});

export const rejectCreatorRequest = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    await User.findByIdAndUpdate(
        user._id, 
        { request: requestEnum.REJECTED },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Creator request rejected"
    });
});

export const rejectAllRequests = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {

    await User.updateMany(
        { request: requestEnum.PENDING },
        { request: requestEnum.REJECTED },
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(200).json({
        success: true,
        message: "AllCreator requests rejected"
    });
});

export const updateUserRole = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (String(req.user?._id) === req.params.id) {
        return next(new ErrorHandler("Changing self role is prohibited", 400));
    }

    const { role } = req.body;
    if (!role) {
        return next(new ErrorHandler("Please provide a role", 400));
    }

    if (!Object.values(roleEnum).includes(role)) {
        return next(new ErrorHandler("Invalid role", 400));
    }

    if (user.role === role) {
        return next(new ErrorHandler(`User is already set to ${role} role`, 400));
    }
    
    const newUser = await User.findByIdAndUpdate(
        user._id, 
        { role },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user: newUser,
        message: "User role updated successfully"
    });
});

export const getUserById = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const blockUser = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (String(req.user?._id) === req.params.id) {
        return next(new ErrorHandler("Self blocking is prohibited", 400));
    }
    
    const newUser = await User.findByIdAndUpdate(
        user._id, 
        { isBlocked: !user.isBlocked },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user: newUser,
        message: "User blocked successfully"
    });
});

export const deleteUser = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (String(req.user?._id) === req.params.id) {
        return next(new ErrorHandler("Self deleting is prohibited", 400));
    }

    await Blog.deleteMany({ author: user._id });
    await Comment.deleteMany({ user: user._id });
    await Like.deleteMany({ user: user._id });
    
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
        success: true,
        message: "User Deleted",
    });
});

export const deleteComment = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return next(new ErrorHandler("Comment not found", 404));
    }

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
        success: true,
        message: "Comment Deleted",
    });
});

export const deleteBlog =  catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
    }

    await Comment.deleteMany({ post: blog._id });
    await Like.deleteMany({ post: blog._id });
    
    await Blog.findByIdAndDelete(blog._id);

    res.status(200).json({
        success: true,
        message: "Blog Deleted",
    });
});

export const getAdminStats = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const likes = await Like.countDocuments();
    const users = await User.countDocuments({ role: roleEnum.USER });
    const admins = await User.countDocuments({ role: roleEnum.ADMIN });
    const creators = await User.countDocuments({ role: roleEnum.CREATOR });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.status(200).json({
        success: true,
        count: {
            blogs,
            comments,
            likes,
            users,
            admins,
            creators,
            blockedUsers
        }
    });
});