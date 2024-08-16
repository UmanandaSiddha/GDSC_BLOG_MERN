import { CustomRequest } from "../middlewares/auth.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import Blog from "../models/blogModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import Category from "../models/category.js";
import path from "path";
import fs from "fs";

export const createBlog = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const { title, description, content, isPrivate } = req.body;
    if (!title || !description || !content) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    const blog = await Blog.create({
        title,
        description,
        content,
        isPrivate: Boolean(isPrivate),
        author: user._id,
    });

    res.status(200).json({
        success: true,
        blog,
        message: "Blog created successfully"
    });
});

export const uploadCoverImage = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const filename = req.file ? `${process.env.SERVER_URL}/blogs/${req.file.filename}` : "";

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const { title, description, content, category } = req.body;

    let blog;
    if (req.query.id) {
        const blogExits = await Blog.findByIdAndUpdate(req.query.id);
        if (!blogExits) {
            return next(new ErrorHandler("Blog not found", 404));
        }
        if (blogExits.image) {
            const basename = blogExits.image.split('/').pop() || "";
            const imagePath = path.join('./public/blogs', basename);
            try {
                if (fs.existsSync(imagePath)) {
                    await fs.promises.unlink(imagePath);
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
            await Blog.findByIdAndUpdate(
                req.query.id, 
                { image: filename },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }
    } else {
        blog = await Blog.create({
            title: title || "This is a system generated title because of the absence of title",
            description: description || "This is a system generated description because of the absence of description",
            content: content || "<p>This is a system generated content because of the absence of content</p>",
            category,
            image: filename,
            author: user._id,
        });
    }

    res.status(200).json({
        success: true,
        data: {
            file: filename,
            blogId: blog?._id || req.query.id
        },
        message: "Cover Image Uploaded successfully"
    });
});

export const uploadBlogImage = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const filename = req.file ? `${process.env.SERVER_URL}/blogs/${req.file.filename}` : "";

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    let blog;
    if (req.query.id) {
        await Blog.findByIdAndUpdate(
            req.query.id, 
            { $push: { blogImages: filename } },
            { new: true, runValidators: true, useFindAndModify: false }
        );
    } else {
        blog = await Blog.create({
            title: "This is a system generated title because of the absence of title",
            description: "This is a system generated description because of the absence of description",
            content: `<p><img src=${filename} alt=""></p>`,
            image: "https://via.placeholder.com/800x400",
            blogImages: [filename],
            author: user._id,
        });
    }

    res.status(200).json({
        success: true,
        data: {
            file: filename,
            blogId: blog?._id || req.query.id
        },
        message: "Blog Image Uploaded successfully"
    });
});

export const deleteBlogImage = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    const blog = await Blog.findOne({ _id: req.params.id, author: user._id});
    if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
    }

    const { filename } = req.body;
    const imagePath = path.join('./public/blogs', filename);
    try {
        if (fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }

    await Blog.findByIdAndUpdate(
        req.params.id,
        { $pull: { blogImages: filename } },
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(200).json({
        success: true,
        message: "Blog Image Deleted successfully"
    });
});

export const getUserBlogs = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const blogs = await Blog.find({ author: user._id }).populate("author", "name avatar").sort({ $natural: -1 });
    const count = await Blog.countDocuments({ author: user._id });

    res.status(200).json({
        success: true,
        blogs,
        count
    });
});

export const getAllBlogs = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 10;
    const count = await Blog.countDocuments();

    const apiFeatures = new ApiFeatures(
        Blog.find().populate("author", "name avatar").sort({ $natural: -1 }),
        req.query
    )
    .searchBlog()
    .filter();

    // let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

    // if (category) {
    //     link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
    // }

    let filteredBlogs = await apiFeatures.query;
    let filteredBlogsCount = filteredBlogs.length;

    apiFeatures.pagination(resultPerPage);
    filteredBlogs = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        blogs: filteredBlogs,
        filteredBlogsCount
    });
});

export const getBlogById = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const blog = await Blog.findById(req.params.id).populate("author", "name avatar");
    if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
    }

    res.status(200).json({
        success: true,
        blog,
    });
});

export const updateBlog = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
    }

    const { title, description, content, isPrivate, disableComments, category } = req.body;

    if (category) {
        const categoryExists = await Category.findOne({ name: { $regex: category, $options: "i"} });
        if (!categoryExists) {
            await Category.create({
                name: category,
                post: [blog._id]
            });
        } else {
            await Category.findOneAndUpdate(
                { name: category },
                { $push: { post: blog._id } },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }
    }

    const updateData = {
        title: title || blog.title,
        description: description || blog.description,
        content: content || blog.content,
        isPrivate: Boolean(isPrivate),
        disableComments: Boolean(disableComments),
        category: category || blog.category
    }

    const newBlog = await Blog.findByIdAndUpdate(
        req.params.id, 
        updateData,
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        blog: newBlog,
        message: "Blog updated successfully"
    });
});

export const deleteBlog = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Blog deleted successfully"
    });
});

export const getCategory = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.find();
    const count = category.length;

    res.status(200).json({
        success: true,
        category,
        count
    });
});