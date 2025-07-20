import { getPrisma } from "@/lib/prisma";

export const getResidentDashboardMetrics = async (
  tenantId: string,
  residentId: number,
) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log(
    "Getting resident dashboard metrics for tenant:",
    tenantId,
    residentId,
  );
  return { message: "Resident dashboard metrics retrieved successfully" };
};

export const getResidents = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Getting residents for tenant:", tenantId);
  return { message: "Residents retrieved successfully" };
};

export const updateResident = async (
  residentId: number,
  data: any,
  tenantId: string,
) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Updating resident:", residentId, data);
  return { message: "Resident updated successfully" };
};

export const createResident = async (data: any, tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Creating resident:", data);
  return { message: "Resident created successfully" };
};

export const deleteResident = async (residentId: number, tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Deleting resident:", residentId);
  return { message: "Resident deleted successfully" };
};
