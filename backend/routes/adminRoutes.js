import { Router } from "express";
import { checkIsLoggedIn } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { changeStatus, getDashboardStats, getMyJobs, getAllApplications } from "../controllers/adminController.js";

export const adminRouter = Router();

adminRouter.patch('/:id/updatestatus', checkIsLoggedIn, authorizeRoles('admin'), changeStatus)
adminRouter.get("/my-jobs",checkIsLoggedIn,authorizeRoles("admin"),getMyJobs);
adminRouter.get("/dashboard-stats",checkIsLoggedIn,authorizeRoles("admin"),getDashboardStats);
adminRouter.get("/applications", checkIsLoggedIn, authorizeRoles("admin"), getAllApplications);

