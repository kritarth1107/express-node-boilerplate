import jwt from "jsonwebtoken";
import config from "../config/app.config.js";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]; // ✅ Get Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                success: false,
                message: "No Bearer token provided",
                errorCode: "NO_TOKEN",
            });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract token
        const secret = config.jwt.secret; // ✅ Get secret from config

        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "JWT secret not configured",
                errorCode: "JWT_SECRET_MISSING",
            });
        }

        // ✅ Verify JWT
        const decodedData = jwt.verify(token, secret);

        /**
         * ✅ Fetch user data based on `decodedData.id`
         * - Example: Fetch from MongoDB, Redis, or any other storage.
         * - If using MongoDB (Mongoose), uncomment and use the following:
         * 
         * import { usersModel } from "../models/user.model.js";
         * const user = await usersModel.findById(decodedData.id);
         * if (!user) {
         *     return res.status(403).json({
         *         success: false,
         *         message: "No user account found",
         *         errorCode: "USER_NOT_FOUND",
         *     });
         * }
         * req.user = user;
         */

        req.user = decodedData; // ✅ Attach decoded data if no DB lookup is needed
        next(); // ✅ Proceed to the next middleware/controller

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message,
            errorCode: "INVALID_TOKEN",
        });
    }
};

export default verifyToken;
