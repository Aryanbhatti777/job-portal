import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { AddJob, getJobById, getJobs } from "../controllers/jobController.js";

export const jobRouter = Router();

jobRouter.post('/jobs', checkIsLoggedIn, authorizeRoles("admin"), AddJob);
jobRouter.get('/', getJobs);
jobRouter.get('/:id',getJobById);