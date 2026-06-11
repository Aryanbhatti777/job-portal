import { Routes, Route } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import Profile from "../pages/Profile";
import VerifyOtp from "../pages/verifyOtp";

import Dashboard from "../pages/admin/Dashboard";
import CreateJob from "../pages/admin/CreateJob";
import EditJob from "../pages/admin/EditJob";
import Applicants from "../pages/admin/Applicants";
import Applications from "../pages/admin/Applications";

import ProtectedRoute from "../components/ProtectedRoute";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Home from "../pages/Home";

const AppRoutes = () => {
    return (
        <Routes>

            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path='/jobs' element={<Jobs/>}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path='/about' element={<About/>}/>
            <Route path='/contact' element={<Contact/>}/>

            {/* OTP route (IMPORTANT for signup flow) */}
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* protected user routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={["seeker", "admin"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* admin only routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/create-job"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateJob />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/edit-job/:id"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <EditJob />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/applicants/:jobId"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Applicants />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/applications"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Applications />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<h2 style={{ padding: "20px" }}>Page not found</h2>} />

        </Routes>
    );
};

export default AppRoutes;