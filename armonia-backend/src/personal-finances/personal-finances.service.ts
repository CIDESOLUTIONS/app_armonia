import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePersonalTransactionDto,
  UpdatePersonalTransactionDto,
  PersonalTransactionDto,
  PersonalTransactionFilterParamsDto,
} from '../common/dto/personal-finances.dto';

@Injectable()
export class PersonalFinancesService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    schemaName: string,
    userId: string,
    data: CreatePersonalTransactionDto,
  ): Promise<PersonalTransactionDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.personalFinance.create({
      data: { ...data, userId },
    });
  }

  async getTransactions(
    schemaName: string,
    userId: string,
    filters: PersonalTransactionFilterParamsDto,
  ): Promise<PersonalTransactionDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = { userId };
    if (filters.type) where.type = filters.type;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.startDate)
      where.date = { ...where.date, gte: new Date(filters.startDate) };
    if (filters.endDate)
      where.date = { ...where.date, lte: new Date(filters.endDate) };

    return prisma.personalFinance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async updateTransaction(
    schemaName: string,
    userId: string,
    id: string,
    data: UpdatePersonalTransactionDto,
  ): Promise<PersonalTransactionDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const transaction = await prisma.personalFinance.findUnique({
      where: { id },
    });
    if (!transaction || transaction.userId !== userId) {
      throw new UnauthorizedException('Transaction not found or unauthorized');
    }
    return prisma.personalFinance.update({
      where: { id },
      data,
    });
  }

  async deleteTransaction(
    schemaName: string,
    userId: string,
    id: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const transaction = await prisma.personalFinance.findUnique({
      where: { id },
    });
    if (!transaction || transaction.userId !== userId) {
      throw new UnauthorizedException('Transaction not found or unauthorized');
    }
    await prisma.personalFinance.delete({ where: { id } });
  }
}
