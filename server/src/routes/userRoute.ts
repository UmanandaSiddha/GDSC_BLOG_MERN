import express from "express";
import { 
    createCreatorRequest,
    forgotPassword,
    getAllAuthors,
    getAuthor,
    getUser,
    loginUser, 
    logoutUser, 
    registerUser, 
    requestForgot, 
    requestVerification,
    resetPassword,
    setPassword,
    updateProfile,
    uploadProfilePicture,
    verifyUser
} from "../controllers/userController.js";
import { isAuthenticatedUser, isUserVerified } from "../middlewares/auth.js";
import { uploadAvatar } from "../config/multerConfig.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/author/all").get(getAllAuthors);
router.route("/author/:id").get(getAuthor);
router.route("/request/forgot").post(requestForgot);
router.route("/forgot/password/:token").put(forgotPassword);
router.route("/verify").put(isAuthenticatedUser, verifyUser);
router.route("/me").get(isAuthenticatedUser, getUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/request/verify").get(isAuthenticatedUser, requestVerification);
router.route("/request/creator").get(isAuthenticatedUser, isUserVerified, createCreatorRequest);
router.route("/set/password").put(isAuthenticatedUser, isUserVerified, setPassword);
router.route("/update/password").put(isAuthenticatedUser, isUserVerified, resetPassword);
router.route("/update/profile").put(isAuthenticatedUser, isUserVerified, updateProfile);
router.route("/upload/avatar").put(isAuthenticatedUser, isUserVerified, uploadAvatar.single("avatar"), uploadProfilePicture);

export default router;