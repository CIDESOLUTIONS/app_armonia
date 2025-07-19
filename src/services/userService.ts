import { fetchApi } from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
  complexId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password?: string;
  role: string;
  complexId?: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  active?: boolean;
  complexId?: number;
}

export async function getAllUsers(role?: string): Promise<User[]> {
  try {
    const query = role ? `?role=${role}` : "";
    const response = await fetchApi(`/users${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<User> {
  try {
    const response = await fetchApi(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
}

export async function createUser(data: CreateUserDto): Promise<User> {
  try {
    const response = await fetchApi("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
  try {
    const response = await fetchApi(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await fetchApi(`/users/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}