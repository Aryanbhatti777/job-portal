import { Router } from "express";
import * as authController from '../controllers/authController.js';
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post('/register', authController.Register);
authRouter.post('/login',authController.Login);
