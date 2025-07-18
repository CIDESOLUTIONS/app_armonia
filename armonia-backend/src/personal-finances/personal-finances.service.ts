import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePersonalTransactionDto,
  UpdatePersonalTransactionDto,
  PersonalTransactionDto,
  PersonalTransactionFilterParamsDto,
} from '../common/dto/personal-finances.dto';

@Injectable()
export class PersonalFinancesService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createTransaction(schemaName: string, userId: number, data: CreatePersonalTransactionDto): Promise<PersonalTransactionDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.personalTransaction.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getTransactions(schemaName: string, userId: number, filters: PersonalTransactionFilterParamsDto): Promise<PersonalTransactionDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = { userId };

    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.startDate) {
      where.date = { ...where.date, gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.date = { ...where.date, lte: new Date(filters.endDate) };
    }
    if (filters.search) {
      where.description = { contains: filters.search, mode: 'insensitive' };
    }

    return prisma.personalTransaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async updateTransaction(schemaName: string, userId: number, id: number, data: UpdatePersonalTransactionDto): Promise<PersonalTransactionDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const transaction = await prisma.personalTransaction.findFirst({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada o no pertenece al usuario.`);
    }
    return prisma.personalTransaction.update({
      where: { id },
      data,
    });
  }

  async deleteTransaction(schemaName: string, userId: number, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const transaction = await prisma.personalTransaction.findFirst({ where: { id, userId } });
    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada o no pertenece al usuario.`);
    }
    await prisma.personalTransaction.delete({ where: { id } });
  }
}