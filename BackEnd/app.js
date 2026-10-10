import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectToDataBase from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRouter.js";
import { protect } from "./middlewares/authMiddleWare.js";

const app = express();

// Middlewares
app.use(express.json());

// CORS configuration supporting production domains and local dev
const corsOptions = {
    origin: process.env.CLIENT_URL || true,
    credentials: true,
};
app.use(cors(corsOptions));

// Health check and root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Authentication API is running successfully",
        status: "OK"
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy" });
});

// Routes
app.use('/api/auth', userRouter);
app.use('/product', productRouter);

app.get('/me', protect, async (req, res) => {
    res.status(200).json({
        message: "Authorized",
        user: req.user
    });
});

// Start Server with Database Connection
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await connectToDataBase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();