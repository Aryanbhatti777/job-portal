import { Router } from "express";
import * as authController from '../controllers/authController.js';
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

export const authRouter = Router();

authRouter.post('/register', authController.Register);
authRouter.post('/login',authController.Login);
authRouter.post("/logout", authController.logout);
authRouter.post('/send-otp', sendOtp)
authRouter.post('/verify-otp', verifyOtp)
