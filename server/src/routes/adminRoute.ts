import express from "express";
import { roleEnum } from "../models/userModel.js";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middlewares/auth.js";
import { acceptCreatorRequest, blockUser, deleteUser, getAllUsers, getUserById, rejectAllRequests, rejectCreatorRequest, updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

router.route("/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), getAllUsers);
router.route("/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), getUserById)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), updateUserRole)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), deleteUser);
router.route("/block/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), blockUser);
router.route("/request/accept/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), acceptCreatorRequest);
router.route("/request/reject/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), rejectCreatorRequest);
router.route("/request/reject/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(roleEnum.ADMIN), rejectAllRequests);


export default router;