import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

  private mapToPersonalTransactionDto(transaction: any): PersonalTransactionDto {
    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      // categoryId: transaction.categoryId, // Not in schema.prisma
      // notes: transaction.notes, // Not in schema.prisma
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  async createTransaction(
    schemaName: string,
    userId: string,
    data: CreatePersonalTransactionDto,
  ): Promise<PersonalTransactionDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const transaction = await prisma.personalFinance.create({
      data: {
        userId: userId,
        type: data.type,
        description: data.description,
        amount: data.amount,
        date: new Date(data.date),
        // categoryId: data.categoryId, // Not in schema.prisma
        // notes: data.notes, // Not in schema.prisma
      },
    });
    return this.mapToPersonalTransactionDto(transaction);
  }

  async getTransactions(
    schemaName: string,
    userId: string,
    filters: PersonalTransactionFilterParamsDto,
  ): Promise<PersonalTransactionDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = { userId };
    if (filters.type) where.type = filters.type;
    // if (filters.categoryId) where.categoryId = filters.categoryId; // Not in schema.prisma
    if (filters.startDate)
      where.date = { ...where.date, gte: new Date(filters.startDate) };
    if (filters.endDate)
      where.date = { ...where.date, lte: new Date(filters.endDate) };

    const transactions = await prisma.personalFinance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    return transactions.map(this.mapToPersonalTransactionDto);
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
    const updatedTransaction = await prisma.personalFinance.update({
      where: { id },
      data: {
        type: data.type,
        description: data.description,
        amount: data.amount,
        date: data.date ? new Date(data.date) : undefined,
        // categoryId: data.categoryId, // Not in schema.prisma
        // notes: data.notes, // Not in schema.prisma
      },
    });
    return this.mapToPersonalTransactionDto(updatedTransaction);
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
