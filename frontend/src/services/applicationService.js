import axiosInstance from "../utils/axiosInstance";

export const applyForJob = async (jobId) => {
  return await axiosInstance.post(`/application/${jobId}/applyjobs`);
};

export const getMyApplications = async () => {
  return await axiosInstance.get("/profile/my-applications");
};

export const checkApplicationStatus = async (jobId) => {
  try {
    const res = await getMyApplications();
    const applications = res.data.applications || [];
    return applications.find(app => app.job._id === jobId);
  } catch (err) {
    return null;
  }
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return await axiosInstance.put("/profile/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
