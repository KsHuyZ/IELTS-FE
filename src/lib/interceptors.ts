import { getStorage, removeLocalStorage } from "@/utils/storage";
import {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const accessToken = getStorage("token") as string;
  if (accessToken !== undefined) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response.data;
};

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    removeLocalStorage();
    window.location.replace("/login");
  }
  return await Promise.reject(error.response?.data);
};
