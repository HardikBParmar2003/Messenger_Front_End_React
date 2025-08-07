import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "https://messenger-sequelize.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status == 400) {
      toast.error(error.response?.data.message);
    } else if (error.response?.status == 401) {
      toast.error(error.response?.data.message);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } else if (error.response?.status == 404) {
      toast.error(error.response?.data.message);
    } else if (error.response?.status == 500) {
      toast.error(error.response?.data.message);
    } else {
      toast.error("Network errror try after some time");
    }
    return Promise.reject(error);
  }
);
