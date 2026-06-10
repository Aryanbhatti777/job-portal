import { Router } from "express"
import { applyJob } from "../controllers/applicationController.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";

export const ApplicationRouter = Router();


ApplicationRouter.post('/:jobId/applyjobs', checkIsLoggedIn, authorizeRoles('seeker'), applyJob)

