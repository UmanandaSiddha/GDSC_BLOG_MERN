import express from "express";
import { getLike, getPostLikes, likeDelete, likePost, updateView } from "../controllers/likeController.js";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middlewares/auth.js";

const router = express.Router();

router.route("/do/:id").get(isAuthenticatedUser, isUserVerified, likePost);
router.route("/undo/:id").get(isAuthenticatedUser, isUserVerified, likeDelete);
router.route("/fetch/:id").get(isAuthenticatedUser, isUserVerified, getLike);
router.route("/fetch/all/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin", "creator"), getPostLikes);
router.route("/update/view").put(updateView);

export default router;