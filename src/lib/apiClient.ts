import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // Adjust this to your API's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors for handling tokens or errors globally
apiClient.interceptors.request.use((config) => {
  // e.g., get token from localStorage or a store
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
