import { getPrisma } from "@/lib/prisma";

export enum FeeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export interface FeeDto {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  propertyId?: number;
  unitId?: number;
  residentId?: number;
  description?: string;
  type: "ORDINARY" | "EXTRAORDINARY" | "FINE";
}

export async function getFees(
  filters?: {
    residentId?: number;
    type?: "ORDINARY" | "EXTRAORDINARY" | "FINE";
  },
  tenantId?: string,
): Promise<FeeDto[]> {
  const prisma = getPrisma(tenantId);
  const where: any = {};

  if (filters?.residentId) {
    where.residentId = filters.residentId;
  }
  if (filters?.type) {
    where.type = filters.type;
  }

  return await prisma.fee.findMany({ where });
}

export const createFee = async (data: any, tenantId: string) => {
  const prisma = getPrisma(tenantId);
  return await prisma.fee.create({ data });
};

export const updateFee = async (id: number, data: any, tenantId: string) => {
  const prisma = getPrisma(tenantId);
  return await prisma.fee.update({ where: { id }, data });
};

export const deleteFee = async (id: number, tenantId: string) => {
  const prisma = getPrisma(tenantId);
  return await prisma.fee.delete({ where: { id } });
};

export const initiatePayment = async (feeId: number, tenantId: string) => {
  // Placeholder for payment initiation logic
  console.log(`Initiating payment for fee ${feeId} in tenant ${tenantId}`);
  return {
    success: true,
    message: "Payment initiated successfully",
    paymentUrl: "https://example.com/payment",
  };
};

export const generateOrdinaryFees = async (tenantId: string) => {
  // Placeholder for ordinary fee generation logic
  console.log(`Generating ordinary fees for tenant ${tenantId}`);
  return { success: true, message: "Ordinary fees generated successfully" };
};
