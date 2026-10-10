import { Router } from "express";
import { protect } from "../middlewares/authMiddleWare.js";

const router = Router();

router.get('/', protect, (req, res) => {
    return res.status(200).json([
        {
            id: 1,
            name: "MacBook Pro 16\"",
            category: "Laptops",
            price: 2499,
            description: "M3 Max, 36GB Unified Memory, 1TB SSD"
        },
        {
            id: 2,
            name: "iPhone 16 Pro",
            category: "Smartphones",
            price: 1199,
            description: "Titanium design, A18 Pro chip, 48MP Fusion camera"
        },
        {
            id: 3,
            name: "Sony WH-1000XM5",
            category: "Audio",
            price: 399,
            description: "Industry-leading noise cancellation headphones"
        },
        {
            id: 4,
            name: "Apple Watch Ultra 2",
            category: "Wearables",
            price: 799,
            description: "Rugged GPS + Cellular smartwatch for athletes"
        }
    ]);
});

export default router;