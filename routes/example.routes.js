import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
} from "../controller/example.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Public Routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user

// ✅ Protected Routes (Requires JWT Token)
router.get("/profile", verifyToken, getUserProfile); // Fetch user profile
router.put("/profile", verifyToken, updateUserProfile); // Update user profile
router.delete("/delete", verifyToken, deleteUser); // Delete user account

export { router };
