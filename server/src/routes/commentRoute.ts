import express from "express";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middlewares/auth.js";
import { createComment, deleteComment, getAllComments, getPostComments, updateComment } from "../controllers/commentController.js";

const router = express.Router();

router.route("/post/:id").get(getPostComments);
router.route("/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllComments);
router.route("/create/:id").post(isAuthenticatedUser, isUserVerified, createComment);
router.route("/edit/:id")
    .put(isAuthenticatedUser, isUserVerified, updateComment)
    .delete(isAuthenticatedUser, isUserVerified, deleteComment);

export default router;