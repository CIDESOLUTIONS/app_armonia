import { apiClient } from "@/lib/apiClient";

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
    const response = await apiClient.get('/user-management/staff');
    return response.data;
  },
  createStaffUser: async (data: CreateStaffUserData): Promise<StaffUser> => {
    const response = await apiClient.post('/user-management/staff', data);
    return response.data;
  },
  updateStaffUser: async (id: number, data: UpdateStaffUserData): Promise<StaffUser> => {
    const response = await apiClient.put(`/user-management/staff/${id}`, data);
    return response.data;
  },
  deleteStaffUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/user-management/staff/${id}`);
  },
};