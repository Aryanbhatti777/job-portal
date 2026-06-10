import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { AddJob, deleteJob, getJobById, getJobs, updateJob } from "../controllers/jobController.js";

export const jobRouter = Router();

jobRouter.post('/jobs', checkIsLoggedIn, authorizeRoles("admin"), AddJob);
jobRouter.get('/', getJobs);
jobRouter.get('/:id',getJobById);
jobRouter.put('/:id', checkIsLoggedIn, authorizeRoles('admin'), updateJob);
jobRouter.delete('/:id', checkIsLoggedIn, authorizeRoles('admin'), deleteJob);