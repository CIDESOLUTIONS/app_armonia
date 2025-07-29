import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreatePersonalTransactionDto,
  UpdatePersonalTransactionDto,
  PersonalTransactionDto,
  PersonalTransactionFilterParamsDto,
} from '../common/dto/personal-finances.dto.js';

@Injectable()
export class PersonalFinancesService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(schemaName: string, userId: number, data: CreatePersonalTransactionDto): Promise<PersonalTransactionDto> {
    const prisma = this.prisma;
    return prisma.personalTransaction.create({
      data: { ...data, userId },
    });
  }

  async getTransactions(schemaName: string, userId: number, filters: PersonalTransactionFilterParamsDto): Promise<PersonalTransactionDto[]> {
    const prisma = this.prisma;
    const where: any = { userId };
    if (filters.type) where.type = filters.type;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.startDate) where.date = { ...where.date, gte: new Date(filters.startDate) };
    if (filters.endDate) where.date = { ...where.date, lte: new Date(filters.endDate) };

    return prisma.personalTransaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async updateTransaction(schemaName: string, userId: number, id: number, data: UpdatePersonalTransactionDto): Promise<PersonalTransactionDto> {
    const prisma = this.prisma;
    const transaction = await prisma.personalTransaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      throw new UnauthorizedException('Transaction not found or unauthorized');
    }
    return prisma.personalTransaction.update({
      where: { id },
      data,
    });
  }

  async deleteTransaction(schemaName: string, userId: number, id: number): Promise<void> {
    const prisma = this.prisma;
    const transaction = await prisma.personalTransaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      throw new UnauthorizedException('Transaction not found or unauthorized');
    }
    await prisma.personalTransaction.delete({ where: { id } });
  }
}
