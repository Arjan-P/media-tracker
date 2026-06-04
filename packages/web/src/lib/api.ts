import { useAuthStore } from "@/features/auth";
import { errorResponse } from "@media-tracker/shared";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  // success handler
  (res) => res,
  // error handler
  (error: AxiosError) => {
    const parsed = errorResponse.safeParse(error.response?.data);
    if (parsed.success) {
      return Promise.reject(parsed.data.error);
    }
    return Promise.reject({ code: "UNKNOWN", message: "Something went wrong" });
  },
);
