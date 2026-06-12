import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { getApplications, getMe, upload, uploadResume } from "../controllers/profileController.js";


export const profileRouter = Router();

profileRouter.get('/me', checkIsLoggedIn, getMe)
profileRouter.put("/resume",checkIsLoggedIn, upload.single("resume"), uploadResume);
profileRouter.get('/my-applications', checkIsLoggedIn, getApplications)
