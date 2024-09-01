import express from "express";
import { 
    createBlog, 
    deleteBlog, 
    deleteBlogImage, 
    getAllBlogs, 
    getAuthorBlogs, 
    getBlogById, 
    getCategory, 
    getUserBlogs, 
    updateBlog, 
    updateBlogView, 
    uploadBlogImage, 
    uploadCoverImage 
} from "../controllers/blogController.js";
import { roleEnum } from "../models/userModel.js";
import { uploadBlogImages } from "../config/multerConfig.js";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/all").get(getAllBlogs);
router.route("/cate/all").get(getCategory);
router.route("/byId/:id").get(getBlogById);
router.route("/author/:id").get(getAuthorBlogs);
router.route("/user/all").get(isAuthenticatedUser, isUserVerified, getUserBlogs);
router.route("/create").post(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.CREATOR, roleEnum.ADMIN), createBlog);
router.route("/update/view/:id").patch(updateBlogView);
router.route("/edit/:id")
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.CREATOR, roleEnum.ADMIN), updateBlog)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.CREATOR, roleEnum.ADMIN), deleteBlog);
router.route("/delete/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.CREATOR, roleEnum.ADMIN), deleteBlogImage);
router.route("/upload/cover").post(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.CREATOR, roleEnum.ADMIN), uploadBlogImages.single("blogs"), uploadCoverImage);
router.route("/upload/blog").post(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.CREATOR, roleEnum.ADMIN), uploadBlogImages.single("blogs"), uploadBlogImage);


export default router;