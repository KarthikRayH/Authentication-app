import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Username, Email and Password are required",
                success: false
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "This email is already registered. Please log in.",
                success: false
            });
        }

        const existingUsername = await User.findOne({ userName });
        if (existingUsername) {
            return res.status(400).json({
                message: "This username is already taken. Please choose another.",
                success: false
            });
        }

        const newUser = await User.create({
            userName,
            email,
            password
        });

        const token = generateToken(newUser._id);

        return res.status(201).json({
            message: "User registered successfully",
            token,
            userName: newUser.userName,
            email: newUser.email,
            success: true
        });

    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required",
                success: false
            });
        }

        const currUser = await User.findOne({ email });
        if (!currUser) {
            return res.status(400).json({
                message: "This email is not registered",
                success: false
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, currUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            });
        }

        const token = generateToken(currUser._id);
        return res.status(200).json({
            id: currUser._id,
            email: currUser.email,
            userName: currUser.userName,
            token,
            success: true
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || "fallback_default_jwt_secret";
    return jwt.sign({ id }, secret, { expiresIn: "3d" });
};

export default { register, login };