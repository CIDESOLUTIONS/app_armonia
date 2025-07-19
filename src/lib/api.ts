import { useComplexStore } from "@/store/complexStore";

export async function fetchApi(
  url: string,
  options?: RequestInit,
  skipContentType?: boolean, // New parameter
) {
  const { selectedComplexId } = useComplexStore.getState(); // Get state outside of component

  const headers: HeadersInit = {
    ...(options?.headers || {}),
  };

  if (!skipContentType) {
    headers["Content-Type"] = "application/json";
  }

  // Get token from localStorage or wherever it's stored
  let token = null;
  if (typeof window !== 'undefined') {
    const authStore = JSON.parse(localStorage.getItem('auth-store') || '{}');
    token = authStore.state?.token; // Adjust based on your actual auth store structure
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (selectedComplexId) {
    headers["X-Tenant-Schema"] = selectedComplexId; // Add tenant schema header
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  // Modificar la URL para apuntar al backend de NestJS
  const nestJsBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const fullUrl = `${nestJsBaseUrl}${url}`;

  const response = await fetch(fullUrl, finalOptions);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}