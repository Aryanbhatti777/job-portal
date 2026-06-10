import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/profileController.js";

export const profileRouter = Router();

profileRouter.get('/me',checkIsLoggedIn, getMe)
