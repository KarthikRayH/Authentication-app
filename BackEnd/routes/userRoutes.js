import { Router } from "express";
import authController from "../controllers/authController.js";
import authValidation from "../middlewares/authValidation.js";

const router = Router();

router.post('/signup', authValidation.signupValidation , authController.register);
router.post('/login',authValidation.loginValidation, authController.login);

export default router;
