import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { changeStatus, getMyJobs } from "../controllers/adminController.js";

export const adminRouter = Router();

adminRouter.patch('/:id/updatestatus', checkIsLoggedIn, authorizeRoles('admin'), changeStatus)
adminRouter.get("/my-jobs",checkIsLoggedIn,authorizeRoles("admin"),getMyJobs);

