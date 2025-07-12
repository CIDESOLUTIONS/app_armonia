// src/lib/api-client.ts
"use client";

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// --- New Types ---
interface User {
  id: number;
  email: string;
  role: string;
  schemaName?: string;
  // Add other user properties as needed
}

interface AuthResponse {
  user: User;
  token: string;
}

interface PQR {
  id: number;
  // Add other PQR properties as needed
}

interface Resident {
  id: number;
  // Add other Resident properties as needed
}

interface Assembly {
  id: number;
  // Add other Assembly properties as needed
}

interface Payment {
  id: number;
  // Add other Payment properties as needed
}

interface Package {
  id: number;
  // Add other Package properties as needed
}

type ListResponse<T> = T[]; // For endpoints returning an array of items

// --- End New Types ---

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || "/api";
    this.timeout = config.timeout || 30000;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Obtener token del localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      return {
        data: data.data || data,
        success: true,
        message: data.message,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }

      throw new Error("Unknown API error");
    }
  }

  // Métodos HTTP
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}`
      : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  async post<T, U = any>(endpoint: string, data?: U): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T, U = any>(endpoint: string, data?: U): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Métodos específicos para módulos
  auth = {
    login: (email: string, password: string, complexId?: number) =>
      this.post<
        AuthResponse,
        { email: string; password: string; complexId?: number }
      >("/auth/login", {
        email,
        password,
        complexId,
      }),

    logout: () => this.post<void>("/auth/logout"),

    verifySession: () => this.get<AuthResponse>("/verify-session"),
  };

  pqr = {
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      this.get<ListResponse<PQR>>("/pqr", params),

    create: (pqrData: Omit<PQR, "id">) =>
      this.post<PQR, Omit<PQR, "id">>("/pqr", pqrData),

    getById: (id: number) => this.get<PQR>(`/pqr/${id}`),

    update: (id: number, updates: Partial<PQR>) =>
      this.put<PQR, Partial<PQR>>(`/pqr/${id}`, updates),

    delete: (id: number) => this.delete<void>(`/pqr/${id}`),
  };

  residents = {
    list: (params?: { page?: number; limit?: number; search?: string }) =>
      this.get<ListResponse<Resident>>("/inventory/residents", params),

    create: (residentData: Omit<Resident, "id">) =>
      this.post<Resident, Omit<Resident, "id">>(
        "/inventory/residents",
        residentData,
      ),
  };

  assemblies = {
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      this.get<ListResponse<Assembly>>("/assemblies", params),

    create: (assemblyData: Omit<Assembly, "id">) =>
      this.post<Assembly, Omit<Assembly, "id">>("/assemblies", assemblyData),
  };

  payments = {
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      this.get<ListResponse<Payment>>("/payments", params),

    create: (paymentData: Omit<Payment, "id">) =>
      this.post<Payment, Omit<Payment, "id">>("/payments", paymentData),

    getById: (id: number) => this.get<Payment>(`/payments/${id}`),
  };

  packages = {
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      this.get<ListResponse<Package>>("/correspondence/packages", params),

    create: (packageData: Omit<Package, "id">) =>
      this.post<Package, Omit<Package, "id">>(
        "/correspondence/packages",
        packageData,
      ),
  };
}

// Singleton instance
export const apiClient = new ApiClient();
export default apiClient;
