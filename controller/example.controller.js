import UserModel from "../model/example.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/app.config.js";

// ✅ Register a New User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
                errorCode: "EMAIL_EXISTS"
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword, phone });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ User Login & JWT Authentication
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                errorCode: "INVALID_CREDENTIALS"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                errorCode: "INVALID_CREDENTIALS"
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, config.jwt.secret, {
            expiresIn: config.jwt.validity
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Fetch User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await UserModel.findByIdAndUpdate(req.user.id, { name, phone }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Delete User Account
export const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errorCode: "USER_NOT_FOUND"
            });
        }

        res.status(200).json({
            success: true,
            message: "User account deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
