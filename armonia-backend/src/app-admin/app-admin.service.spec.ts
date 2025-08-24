import { Test, TestingModule } from '@nestjs/testing';
import { AppAdminService } from './app-admin.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  residentialComplex: {
    count: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    count: jest.fn(),
  },
  plan: {
    findMany: jest.fn(),
  },
  subscription: {
    findMany: jest.fn(),
  },
  // Mock getTenantDB just in case it's called, though it shouldn't be for this service
  getTenantDB: jest.fn().mockReturnThis(), 
};

describe('AppAdminService', () => {
  let service: AppAdminService;
  let prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppAdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppAdminService>(AppAdminService);
    prisma = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOperativeMetrics', () => {
    it('should calculate and return operative metrics correctly', async () => {
      // Mock Data
      const mockPlans = [
        { id: 'plan-1', name: 'Premium', price: 100, billingCycle: 'MONTHLY' },
        { id: 'plan-2', name: 'Standard', price: 1200, billingCycle: 'YEARLY' },
      ];
      const mockSubscriptions = [
        { id: 'sub-1', status: 'ACTIVE', plan: mockPlans[0] }, // 100/month
        { id: 'sub-2', status: 'ACTIVE', plan: mockPlans[0] }, // 100/month
        { id: 'sub-3', status: 'ACTIVE', plan: mockPlans[1] }, // 100/month (1200/12)
      ];
      const mockComplexesByPlan = [
        { planId: 'plan-1', _count: { id: 2 } },
        { planId: 'plan-2', _count: { id: 1 } },
      ];

      // Mock Prisma Calls
      prisma.residentialComplex.count.mockResolvedValue(3);
      prisma.user.count.mockResolvedValue(150);
      prisma.plan.findMany.mockResolvedValue(mockPlans);
      prisma.subscription.findMany.mockResolvedValue(mockSubscriptions);
      prisma.residentialComplex.groupBy.mockResolvedValue(mockComplexesByPlan);

      // Execute
      const result = await service.getOperativeMetrics();

      // Assert
      expect(result.totalComplexes).toBe(3);
      expect(result.totalUsers).toBe(150);
      // MRR = 100 (plan-1) + 100 (plan-1) + (1200/12) (plan-2) = 300
      expect(result.mrr).toBe(300);
      // ARR = 300 * 12 = 3600
      expect(result.arr).toBe(3600);
      expect(result.complexesByPlan).toHaveLength(2);
      expect(result.complexesByPlan).toContainEqual({ name: 'Premium', count: 2 });
      expect(result.complexesByPlan).toContainEqual({ name: 'Standard', count: 1 });
    });
  });
});
