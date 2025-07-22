import { fetchApi } from "@/lib/api";
import { CreateUserDto, UpdateUserDto } from "@/common/dto/user.dto"; // Assuming these DTOs exist

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: "RECEPTION" | "STAFF" | "SECURITY";
  isActive: boolean;
}

export async function getStaffUsers(): Promise<StaffUser[]> {
  return fetchApi("/staff");
}

export async function createStaffUser(data: CreateUserDto): Promise<StaffUser> {
  return fetchApi("/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStaffUser(id: number, data: UpdateUserDto): Promise<StaffUser> {
  return fetchApi(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStaffUser(id: number): Promise<void> {
  return fetchApi(`/staff/${id}`, {
    method: "DELETE",
  });
}
