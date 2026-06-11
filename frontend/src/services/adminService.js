import axiosInstance from "../utils/axiosInstance";

export const getDashboardStats = async () => {
  return await axiosInstance.get("/admin/dashboard-stats");
};

export const getMyJobs = async () => {
  return await axiosInstance.get("/admin/my-jobs");
};

export const getAllApplications = async () => {
  return await axiosInstance.get("/admin/applications");
};

export const addJob = async (data) => {
  return await axiosInstance.post("/jobs/addjobs", data);
};

export const updateJob = async (id, data) => {
  return await axiosInstance.put(`/jobs/updatejobs/${id}`, data);
};

export const deleteJob = async (id) => {
  return await axiosInstance.delete(`/jobs/deletejobs/${id}`);
};

export const getJobById = async (id) => {
  return await axiosInstance.get(`/jobs/getjobs/${id}`);
};

export const getApplicants = async (jobId) => {
  return await axiosInstance.get(`/jobs/${jobId}/applicants`);
};

export const changeApplicationStatus = async (applicationId, status) => {
  return await axiosInstance.patch(`/admin/${applicationId}/updatestatus`, { status });
};
