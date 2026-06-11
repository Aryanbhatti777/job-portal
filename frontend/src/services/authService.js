import axiosInstance from "../utils/axiosInstance";

export const requestOtp = async (data) => {
  return await axiosInstance.post("/auth/send-otp", data);
};

export const verifyOtp = async (data) => {
  return await axiosInstance.post("/auth/verify-otp", data);
};

export const loginUser = async (data) => {
  return await axiosInstance.post("/auth/login", data);
};
