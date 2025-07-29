import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentStatus } from '../common/enums/payment-status.enum.js';
import { FeeStatus } from '../common/enums/fee-status.enum.js';

@Injectable()
export class BankReconciliationService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async reconcileBankStatement(
    schemaName: string,
    transactions: any[], // This would be a DTO for bank transactions
  ): Promise<any> {
    const prisma = this.prisma;
    const reconciliationResults: any[] = [];

    for (const bankTransaction of transactions) {
      // Attempt to find a matching payment in the system
      const matchingPayment = await prisma.payment.findFirst({
        where: {
          amount: bankTransaction.amount,
          // Add more sophisticated matching logic here (e.g., date range, reference number)
          status: PaymentStatus.PENDING, // Only match pending payments
        },
      });

      if (matchingPayment) {
        // If a match is found, update the payment status to COMPLETED
        await prisma.payment.update({
          where: { id: matchingPayment.id },
          data: { status: PaymentStatus.COMPLETED, paymentDate: new Date() },
        });

        // Update the associated fee status
        if (matchingPayment.feeId) {
          await prisma.fee.update({
            where: { id: matchingPayment.feeId },
            data: { status: FeeStatus.PAID },
          });
        }

        reconciliationResults.push({
          bankTransaction,
          systemPayment: matchingPayment,
          status: 'MATCHED',
        });
      } else {
        // If no match is found, flag it as unmatched
        reconciliationResults.push({
          bankTransaction,
          systemPayment: null,
          status: 'UNMATCHED',
        });
      }
    }

    return reconciliationResults;
  }
}