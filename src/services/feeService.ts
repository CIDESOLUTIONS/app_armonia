import { getPrisma } from "@/lib/prisma";

export const getFees = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  return await prisma.fee.findMany();
};

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

export const generateFees = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Add logic to generate fees
  console.log("Generating fees for tenant:", tenantId);
  return { message: "Fees generated successfully" };
};
