import type { User } from "@/interface/interface";
import { api } from "./axios";

export const sendOtp = (formData: FormData) => {
  return api.post("/user/sendOtp", formData);
};

export const verifyOtp = (formData: FormData) => {
  return api.post("/user/otpVerification", formData);
};

export const logInUser = (data: FormData) => {
  return api.post("/user/loginUser", data);
};

export const logOutUser = () => {
  return api.delete("/user/logOutUser");
};

export const signUpUser = (data: User) => {
  return api.post("/user/signUpUser", data);
};

export const getToken = () => {
  return api.get("/user/getToken");
};

export const getEmail = () => {
  return api.get("/user/getEmail");
};
