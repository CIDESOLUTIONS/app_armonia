import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }
  return config;
});

export const fetchApi = async <T>(
  url: string,
  options: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(url, options);
    return response.data;
  } catch (error) {
    // Handle or throw error as needed
    console.error("API call failed:", error);
    throw error;
  }
};

export { apiClient };
export default apiClient;
