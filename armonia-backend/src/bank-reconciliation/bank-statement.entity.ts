export class BankStatement {
  id: string;
  schemaName: string;
  bankName: string;
  accountNumber: string;
  startDate: Date;
  endDate: Date;
  uploadedAt: Date;
  uploadedById: string;
  totalTransactions: number;
  totalAmount: number;
  status: 'UPLOADED' | 'PROCESSING' | 'RECONCILED' | 'ERROR';
  transactions: BankTransaction[];
}

export class BankTransaction {
  id: string;
  statementId: string;
  transactionId: string;
  description: string;
  amount: number;
  date: Date;
  reference?: string;
  type: 'CREDIT' | 'DEBIT';
  isReconciled: boolean;
  reconciledAt?: Date;
  paymentId?: string;
  feeId?: string;
  confidence?: number;
  notes?: string;
}

export class ReconciliationRule {
  id: string;
  schemaName: string;
  name: string;
  description: string;
  conditions: any; // JSON with matching conditions
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}