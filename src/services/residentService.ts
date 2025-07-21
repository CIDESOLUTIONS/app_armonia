import { getPrisma } from "@/lib/prisma";

interface ResidentData {
  name?: string;
  email?: string;
  phone?: string;
  propertyId?: number;
  unitNumber?: string;
}

interface CreateResidentData extends ResidentData {
  name: string;
  email: string;
  propertyId: number;
}

export const getResidentDashboardMetrics = async (
  tenantId: string,
  residentId: number,
) => {
  const _prisma = getPrisma(tenantId);
  // Placeholder logic - TODO: Implement actual database query
  console.warn(
    "Getting resident dashboard metrics for tenant:",
    tenantId,
    residentId,
  );
  return { message: "Resident dashboard metrics retrieved successfully" };
};

export const getResidents = async (tenantId: string) => {
  const _prisma = getPrisma(tenantId);
  // Placeholder logic - TODO: Implement actual database query
  console.warn("Getting residents for tenant:", tenantId);
  return { message: "Residents retrieved successfully" };
};

export const updateResident = async (
  residentId: number,
  data: ResidentData,
  tenantId: string,
) => {
  const _prisma = getPrisma(tenantId);
  // Placeholder logic - TODO: Implement actual database query
  console.warn("Updating resident:", residentId, data);
  return { message: "Resident updated successfully" };
};

export const createResident = async (
  data: CreateResidentData,
  tenantId: string,
) => {
  const _prisma = getPrisma(tenantId);
  // Placeholder logic - TODO: Implement actual database query
  console.warn("Creating resident:", data);
  return { message: "Resident created successfully" };
};

export const deleteResident = async (residentId: number, tenantId: string) => {
  const _prisma = getPrisma(tenantId);
  // Placeholder logic - TODO: Implement actual database query
  console.warn("Deleting resident:", residentId);
  return { message: "Resident deleted successfully" };
};
