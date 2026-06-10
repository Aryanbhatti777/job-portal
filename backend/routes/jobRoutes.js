import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { AddJob, deleteJob, getJobById, getJobs, updateJob } from "../controllers/jobController.js";


export const jobRouter = Router();

jobRouter.post('/addjobs', checkIsLoggedIn, authorizeRoles("admin"), AddJob);
jobRouter.get('/getjobs', getJobs);
jobRouter.get('/getjobs/:id',getJobById);
jobRouter.put('/updatejobs/:id', checkIsLoggedIn, authorizeRoles('admin'), updateJob);
jobRouter.delete('/deletejobs/:id', checkIsLoggedIn, authorizeRoles('admin'), deleteJob);
