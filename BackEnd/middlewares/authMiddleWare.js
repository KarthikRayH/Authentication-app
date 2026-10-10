import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized, no token provided",
                success: false
            });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "fallback_default_jwt_secret";

        const decoded = jwt.verify(token, secret);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        next();

    } catch (error) {
        console.error("Token verification failed:", error.message);

        return res.status(401).json({
            message: "Not authorized, token invalid or expired",
            success: false
        });
    }
};