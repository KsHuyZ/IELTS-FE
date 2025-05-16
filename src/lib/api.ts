import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import {
  errorInterceptor,
  requestInterceptor,
  successInterceptor,
} from "./interceptors";
import { getStorage, setStorage } from "@/utils/storage";
import { refreshTokenApi } from "@/api/auth";
const BASE_URL = import.meta.env.VITE_API_URL;

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: `${BASE_URL}/api/v1`,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const api: AxiosInstance = axios.create(axiosRequestConfig);

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(successInterceptor, errorInterceptor);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401) {
      const token = getStorage("token") as string | undefined;
      const refreshToken = token;
      if (refreshToken) {
        const result = await refreshTokenApi(refreshToken);
        setStorage("token", result.token);
        originalRequest.headers = {
          Authorization: "Bearer " + result.token,
        };
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export { api };
