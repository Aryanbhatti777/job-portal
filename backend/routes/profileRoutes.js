import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { getMe, uploadResume } from "../controllers/profileController.js";
import { upload } from "../middleware/upload.js";

export const profileRouter = Router();

profileRouter.get('/me', checkIsLoggedIn, getMe)
profileRouter.put("/resume",checkIsLoggedIn, upload.single("resume"), uploadResume);
