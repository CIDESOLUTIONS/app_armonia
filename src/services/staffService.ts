import { fetchApi } from "@/lib/apiClient";

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface CreateStaffUserData {
  name: string;
  email: string;
  password?: string;
  role: string;
  active?: boolean;
}

export interface UpdateStaffUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  active?: boolean;
}

export const staffService = {
  getStaffUsers: async (): Promise<StaffUser[]> => {
    return fetchApi("/user-management/staff");
  },
  createStaffUser: async (data: CreateStaffUserData): Promise<StaffUser> => {
    return fetchApi("/user-management/staff", { method: "POST", data });
  },
  updateStaffUser: async (
    id: number,
    data: UpdateStaffUserData,
  ): Promise<StaffUser> => {
    return fetchApi(`/user-management/staff/${id}`, { method: "PUT", data });
  },
  deleteStaffUser: async (id: number): Promise<void> => {
    await fetchApi(`/user-management/staff/${id}`, { method: "DELETE" });
  },
};
