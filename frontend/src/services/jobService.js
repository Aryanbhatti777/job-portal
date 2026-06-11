import axiosInstance from "../utils/axiosInstance";

// get all jobs
export const getAllJobs = async () => {
    return await axiosInstance.get("/jobs/getjobs");
};

// get single job
export const getJobById = async (id) => {
    return await axiosInstance.get(`/jobs/getjobs/${id}`);
};