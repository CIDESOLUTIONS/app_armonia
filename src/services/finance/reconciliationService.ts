import { Injectable } from "@nestjs/common";
import { PrismaClientManager } from "../prisma/prisma-client-manager";
import { PrismaService } from "../prisma/prisma.service";

interface BankStatementEntry {
  date: string;
  description: string;
  amount: number;
}

@Injectable()
export class ReconciliationService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  private isSimilarDate(date1: Date, date2: Date) {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5; // Considerar fechas dentro de un rango de 5 días
  }

  async reconcileBankStatement(
    schemaName: string,
    statementEntries: BankStatementEntry[],
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    const pendingPayments = await prisma.payment.findMany({
      where: { status: "PENDING" },
    });

    const suggestions = statementEntries.map((entry) => {
      const potentialMatch = pendingPayments.find(
        (payment) =>
          payment.amount === entry.amount &&
          this.isSimilarDate(new Date(payment.date), new Date(entry.date)) &&
          (entry.description.includes(payment.reference) ||
            payment.reference.includes(entry.description)),
      );

      if (potentialMatch) {
        return {
          statementEntry: entry,
          payment: potentialMatch,
          status: "SUGGESTED",
        };
      }

      return {
        statementEntry: entry,
        payment: null,
        status: "UNMATCHED",
      };
    });

    return suggestions;
  }
}
