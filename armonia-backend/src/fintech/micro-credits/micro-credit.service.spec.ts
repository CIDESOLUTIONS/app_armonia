import { Test, TestingModule } from '@nestjs/testing';
import { MicroCreditService } from './micro-credit.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MicroCreditStatus } from '../../common/dto/fintech.dto';

const mockPrismaService = {
  getTenantDB: jest.fn().mockReturnValue({
    microCreditApplication: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
    fee: {
      create: jest.fn(),
    },
    property: {
        findFirst: jest.fn(),
    },
  }),
};

describe('MicroCreditService', () => {
  let service: MicroCreditService;
  let prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroCreditService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MicroCreditService>(MicroCreditService);
    prisma = mockPrismaService.getTenantDB('test-schema');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createApplication', () => {
    it('should create a new micro-credit application with PENDING status', async () => {
      const dto = { amount: 50000 };
      const userId = 'user-1';
      const expectedApp = { id: 'app-1', userId, ...dto, status: MicroCreditStatus.PENDING };

      prisma.microCreditApplication.create.mockResolvedValue(expectedApp);

      const result = await service.createApplication('test-schema', userId, dto);

      expect(prisma.microCreditApplication.create).toHaveBeenCalledWith({
        data: {
          amount: dto.amount,
          userId: userId,
          status: MicroCreditStatus.PENDING,
        },
      });
      expect(result.status).toBe(MicroCreditStatus.PENDING);
    });
  });

  describe('updateApplicationStatus', () => {
    it('should throw NotFoundException if application does not exist', async () => {
      prisma.microCreditApplication.findUnique.mockResolvedValue(null);
      await expect(service.updateApplicationStatus('test-schema', '999', MicroCreditStatus.APPROVED, 'admin-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if application is not PENDING', async () => {
        const existingApp = { id: 'app-1', status: MicroCreditStatus.APPROVED };
        prisma.microCreditApplication.findUnique.mockResolvedValue(existingApp);
        await expect(service.updateApplicationStatus('test-schema', 'app-1', MicroCreditStatus.APPROVED, 'admin-1')).rejects.toThrow(BadRequestException);
      });

    it('should approve an application, create a payment, and create a fee', async () => {
      const existingApp = { id: 'app-1', userId: 'user-1', amount: 75000, status: MicroCreditStatus.PENDING };
      const userProperty = { id: 'prop-1' };

      prisma.microCreditApplication.findUnique.mockResolvedValue(existingApp);
      prisma.property.findFirst.mockResolvedValue(userProperty);
      prisma.microCreditApplication.update.mockResolvedValue({ ...existingApp, status: MicroCreditStatus.APPROVED });

      const result = await service.updateApplicationStatus('test-schema', 'app-1', MicroCreditStatus.APPROVED, 'admin-1');

      // 1. Verify Payment was created
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: {
          userId: existingApp.userId,
          amount: existingApp.amount,
          date: expect.any(Date),
          method: 'MICRO_CREDIT',
          status: 'COMPLETED',
          transactionId: `credit_approval_${existingApp.id}`,
        },
      });

      // 2. Verify Fee was created
      expect(prisma.fee.create).toHaveBeenCalledWith({
        data: {
            title: 'Pago de Microcrédito',
            description: `Cuota correspondiente al microcrédito aprobado #${existingApp.id}`,
            type: 'LOAN',
            propertyId: userProperty.id,
            amount: existingApp.amount,
            dueDate: expect.any(Date),
        }
      });

      // 3. Verify application status is updated
      expect(prisma.microCreditApplication.update).toHaveBeenCalledWith({
        where: { id: 'app-1' },
        data: { status: MicroCreditStatus.APPROVED },
      });

      expect(result.status).toBe(MicroCreditStatus.APPROVED);
    });

    it('should reject an application without creating payment or fee', async () => {
        const existingApp = { id: 'app-1', userId: 'user-1', amount: 75000, status: MicroCreditStatus.PENDING };
        prisma.microCreditApplication.findUnique.mockResolvedValue(existingApp);
        prisma.microCreditApplication.update.mockResolvedValue({ ...existingApp, status: MicroCreditStatus.REJECTED });
  
        const result = await service.updateApplicationStatus('test-schema', 'app-1', MicroCreditStatus.REJECTED, 'admin-1');
  
        expect(prisma.payment.create).not.toHaveBeenCalled();
        expect(prisma.fee.create).not.toHaveBeenCalled();
        expect(result.status).toBe(MicroCreditStatus.REJECTED);
      });
  });
});
