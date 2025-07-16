import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from './finances.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  PaymentStatus,
  FeeType,
  BudgetStatus,
} from '../common/dto/finances.dto';

const mockPrismaService = {
  fee: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    aggregate: jest.fn(),
    createMany: jest.fn(),
  },
  payment: {
    create: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
    findFirst: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
  },
  budget: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  paymentAttempt: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: jest.fn(() => mockPrismaService),
};

describe('FinancesService', () => {
  let service: FinancesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesService,
        {
          provide: PrismaClientManager,
          useValue: mockPrismaClientManager,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FinancesService>(FinancesService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFees', () => {
    it('should return a list of fees', async () => {
      const schemaName = 'test_schema';
      const filters = { page: 1, limit: 10 };
      const expectedFees = [{ id: 1, title: 'Fee 1' }];
      prisma.fee.findMany.mockResolvedValue(expectedFees);
      prisma.fee.count.mockResolvedValue(1);

      const result = await service.getFees(schemaName, filters);
      expect(result.fees).toEqual(expectedFees);
      expect(result.total).toBe(1);
    });
  });

  describe('getFee', () => {
    it('should return a single fee by ID', async () => {
      const schemaName = 'test_schema';
      const feeId = 1;
      const expectedFee = { id: feeId, title: 'Fee 1' };
      prisma.fee.findUnique.mockResolvedValue(expectedFee);

      const result = await service.getFee(schemaName, feeId);
      expect(result).toEqual(expectedFee);
    });
  });

  describe('createFee', () => {
    it('should create a new fee', async () => {
      const schemaName = 'test_schema';
      const createFeeDto = {
        title: 'New Fee',
        description: 'Description',
        amount: 100,
        type: FeeType.ORDINARY,
        dueDate: '2025-12-31', // Cambiado a string
        propertyId: 1,
        createdById: 1,
      };
      const expectedFee = { id: 1, ...createFeeDto };
      prisma.fee.create.mockResolvedValue(expectedFee);

      const result = await service.createFee(schemaName, createFeeDto);
      expect(result).toEqual(expectedFee);
    });
  });

  describe('updateFee', () => {
    it('should update an existing fee', async () => {
      const schemaName = 'test_schema';
      const feeId = 1;
      const updateFeeDto = { title: 'Updated Fee' };
      const expectedFee = { id: feeId, title: 'Updated Fee' };
      prisma.fee.update.mockResolvedValue(expectedFee);

      const result = await service.updateFee(schemaName, feeId, updateFeeDto);
      expect(result).toEqual(expectedFee);
    });
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const schemaName = 'test_schema';
      const createPaymentDto = {
        amount: 100,
        date: '2025-07-15T10:00:00Z', // Cambiado a string
        method: 'Cash',
        reference: 'REF123',
        receiptNumber: 'REC456',
        feeId: 1,
        propertyId: 1,
        createdBy: 1,
      };
      const expectedPayment = { id: 1, ...createPaymentDto };
      prisma.payment.create.mockResolvedValue(expectedPayment);

      const result = await service.createPayment(schemaName, createPaymentDto);
      expect(result).toEqual(expectedPayment);
    });
  });

  describe('getPropertyPayments', () => {
    it('should return payments for a property', async () => {
      const schemaName = 'test_schema';
      const propertyId = 1;
      const expectedPayments = [{ id: 1, propertyId }];
      prisma.payment.findMany.mockResolvedValue(expectedPayments);

      const result = await service.getPropertyPayments(schemaName, propertyId);
      expect(result).toEqual(expectedPayments);
    });
  });

  describe('getPropertyBalance', () => {
    it('should calculate the correct property balance', async () => {
      const schemaName = 'test_schema';
      const propertyId = 1;
      prisma.fee.aggregate.mockResolvedValue({ _sum: { amount: 200 } });
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 150 } });

      const result = await service.getPropertyBalance(schemaName, propertyId);
      expect(result.balance).toBe(50);
    });
  });

  describe('generateOrdinaryFees', () => {
    it('should generate ordinary fees for specified properties', async () => {
      const schemaName = 'test_schema';
      const amount = 100;
      const dueDate = '2025-12-31';
      const title = 'Monthly Fee';
      const description = 'Description';
      const propertyIds = [1, 2];

      prisma.property.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      prisma.fee.createMany.mockResolvedValue({ count: 2 });

      const result = await service.generateOrdinaryFees(
        schemaName,
        amount,
        dueDate,
        title,
        description,
        propertyIds,
      );
      expect(result.count).toBe(2);
      expect(prisma.fee.createMany).toHaveBeenCalledWith({
        data: [
          {
            title,
            description,
            amount,
            type: FeeType.ORDINARY,
            dueDate,
            propertyId: 1,
          },
          {
            title,
            description,
            amount,
            type: FeeType.ORDINARY,
            dueDate,
            propertyId: 2,
          },
        ],
      });
    });
  });

  describe('createBudget', () => {
    it('should create a new budget with items', async () => {
      const schemaName = 'test_schema';
      const createBudgetDto = {
        year: 2025,
        month: 7,
        title: 'Annual Budget',
        totalAmount: 1000,
        items: [{ description: 'Item 1', amount: 500, category: 'CAT1', order: 1 }],
        createdById: 1,
      };
      const expectedBudget = { id: 1, ...createBudgetDto, items: [{ id: 1, budgetId: 1, ...createBudgetDto.items[0] }] };
      prisma.budget.create.mockResolvedValue(expectedBudget);

      const result = await service.createBudget(schemaName, createBudgetDto);
      expect(result).toEqual(expectedBudget);
    });
  });

  describe('getBudgetsByYear', () => {
    it('should return budgets for a given year', async () => {
      const schemaName = 'test_schema';
      const year = 2025;
      const expectedBudgets = [{ id: 1, year, items: [] }];
      prisma.budget.findMany.mockResolvedValue(expectedBudgets);

      const result = await service.getBudgetsByYear(schemaName, year);
      expect(result).toEqual(expectedBudgets);
    });
  });

  describe('approveBudget', () => {
    it('should approve a budget', async () => {
      const schemaName = 'test_schema';
      const budgetId = 1;
      const expectedBudget = { id: budgetId, status: BudgetStatus.APPROVED };
      prisma.budget.update.mockResolvedValue(expectedBudget);

      const result = await service.approveBudget(schemaName, budgetId);
      expect(result).toEqual(expectedBudget);
    });
  });

  describe('getFinancialStats', () => {
    it('should return financial statistics', async () => {
      const schemaName = 'test_schema';
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 1000 } });
      prisma.fee.aggregate.mockResolvedValue({ _sum: { amount: 500 } });

      const result = await service.getFinancialStats(schemaName);
      expect(result.totalIncome).toBe(1000);
      expect(result.totalExpenses).toBe(500);
      expect(result.currentBalance).toBe(500);
      expect(result.pendingFees).toBe(500); // Assuming pending fees are also 500
    });
  });

  describe('generateFinancialReport', () => {
    it('should generate an income report', async () => {
      const schemaName = 'test_schema';
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      const type = 'INCOME';
      const payments = [{ id: 1, amount: 100, date: new Date(startDate) }];
      prisma.payment.findMany.mockResolvedValue(payments);

      const result = await service.generateFinancialReport(schemaName, startDate, endDate, type);
      expect(result.totalIncome).toBe(100);
      expect(result.totalExpenses).toBe(0);
      expect(result.netBalance).toBe(100);
      expect(result.payments).toEqual(payments);
    });

    it('should generate an expense report', async () => {
      const schemaName = 'test_schema';
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      const type = 'EXPENSE';
      const fees = [{ id: 1, amount: 50, dueDate: new Date(startDate), status: PaymentStatus.PAID }];
      prisma.fee.findMany.mockResolvedValue(fees);

      const result = await service.generateFinancialReport(schemaName, startDate, endDate, type);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(50);
      expect(result.netBalance).toBe(-50);
      expect(result.fees).toEqual(fees);
    });

    it('should generate a balance report', async () => {
      const schemaName = 'test_schema';
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      const type = 'BALANCE';
      const payments = [{ id: 1, amount: 100, date: new Date(startDate) }];
      const fees = [{ id: 1, amount: 50, dueDate: new Date(startDate), status: PaymentStatus.PAID }];
      prisma.payment.findMany.mockResolvedValue(payments);
      prisma.fee.findMany.mockResolvedValue(fees);

      const result = await service.generateFinancialReport(schemaName, startDate, endDate, type);
      expect(result.totalIncome).toBe(100);
      expect(result.totalExpenses).toBe(50);
      expect(result.netBalance).toBe(50);
      expect(result.payments).toEqual(payments);
      expect(result.fees).toEqual(fees);
    });
  });

  describe('processBankStatement', () => {
    it('should process a bank statement and return suggestions', async () => {
      const schemaName = 'test_schema';
      const mockFile = { originalname: 'statement.csv' } as any; // Cambiado a any
      const matchingPayment = { id: 1, amount: 350000 };
      prisma.payment.findFirst.mockResolvedValue(matchingPayment);

      const result = await service.processBankStatement(schemaName, mockFile);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].status).toBe('MATCHED');
    });
  });

  describe('initiatePayment', () => {
    it('should initiate a payment', async () => {
      const schemaName = 'test_schema';
      const userId = 1;
      const initiatePaymentDto = {
        feeId: 1,
        amount: 100,
        paymentMethod: 'Credit Card',
        returnUrl: 'https://example.com/callback', // Añadido returnUrl
      };
      const expectedPaymentGatewayResponse = {
        transactionId: expect.any(String),
        paymentUrl: expect.any(String),
        status: 'PENDING',
      };
      prisma.paymentAttempt.create.mockResolvedValue({});

      const result = await service.initiatePayment(schemaName, userId, initiatePaymentDto);
      expect(result).toEqual(expectedPaymentGatewayResponse);
      expect(prisma.paymentAttempt.create).toHaveBeenCalledWith({
        data: {
          feeId: initiatePaymentDto.feeId,
          userId: userId,
          amount: initiatePaymentDto.amount,
          paymentMethod: initiatePaymentDto.paymentMethod,
          transactionId: expect.any(String),
          status: 'PENDING',
        },
      });
    });
  });

  describe('handlePaymentCallback', () => {
    it('should handle a successful payment callback', async () => {
      const schemaName = 'test_schema';
      const callbackData = { transactionId: 'txn_123', status: 'COMPLETED' };
      const paymentAttempt = {
        id: 1,
        feeId: 1,
        userId: 1,
        amount: 100,
        paymentMethod: 'Credit Card',
        transactionId: 'txn_123',
        status: 'PENDING',
        fee: { propertyId: 1 }, // Mock the fee relation
      };
      prisma.paymentAttempt.findUnique.mockResolvedValue(paymentAttempt);
      prisma.paymentAttempt.update.mockResolvedValue({});
      prisma.payment.create.mockResolvedValue({});
      prisma.fee.update.mockResolvedValue({});

      const result = await service.handlePaymentCallback(callbackData);
      expect(result.message).toContain('procesado');
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: {
          amount: paymentAttempt.amount,
          date: expect.any(String),
          method: paymentAttempt.paymentMethod,
          reference: paymentAttempt.transactionId,
          receiptNumber: expect.any(String),
          feeId: paymentAttempt.feeId,
          propertyId: paymentAttempt.fee.propertyId,
          createdBy: paymentAttempt.userId,
        },
      });
      expect(prisma.fee.update).toHaveBeenCalledWith({
        where: { id: paymentAttempt.feeId },
        data: { status: PaymentStatus.PAID },
      });
    });

    it('should throw NotFoundException if payment attempt not found', async () => {
      const callbackData = { transactionId: 'txn_999', status: 'COMPLETED' };
      prisma.paymentAttempt.findUnique.mockResolvedValue(null);

      await expect(service.handlePaymentCallback(callbackData)).rejects.toThrow(NotFoundException);
    });

    it('should update payment attempt status even if not completed', async () => {
      const callbackData = { transactionId: 'txn_123', status: 'FAILED' };
      const paymentAttempt = {
        id: 1,
        feeId: 1,
        userId: 1,
        amount: 100,
        paymentMethod: 'Credit Card',
        transactionId: 'txn_123',
        status: 'PENDING',
        fee: { propertyId: 1 }, // Mock the fee relation
      };
      prisma.paymentAttempt.findUnique.mockResolvedValue(paymentAttempt);
      prisma.paymentAttempt.update.mockResolvedValue({});
      prisma.payment.create.mockResolvedValue({}); // Should not be called
      prisma.fee.update.mockResolvedValue({}); // Should not be called

      const result = await service.handlePaymentCallback(callbackData);
      expect(result.message).toContain('procesado');
      expect(prisma.paymentAttempt.update).toHaveBeenCalledWith({
        where: { id: paymentAttempt.id },
        data: { status: 'FAILED' },
      });
      expect(prisma.payment.create).not.toHaveBeenCalled();
      expect(prisma.fee.update).not.toHaveBeenCalled();
    });
  });
});