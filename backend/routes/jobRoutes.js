import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { AddJob } from "../controllers/jobController.js";

export const jobRouter = Router();

jobRouter.post('/jobs', checkIsLoggedIn, authorizeRoles("admin"), AddJob)