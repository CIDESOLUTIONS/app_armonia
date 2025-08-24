import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  getTenantDB: jest.fn().mockReturnValue({
    property: {
      count: jest.fn(),
    },
    resident: {
      count: jest.fn(),
    },
    fee: {
      aggregate: jest.fn(),
    },
    pqr: {
      count: jest.fn(),
    },
  }),
};

describe('PortfolioService', () => {
  let service: PortfolioService;
  let prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    prisma = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConsolidatedMetrics', () => {
    it('should calculate and return consolidated metrics', async () => {
      const mockUser = {
        id: 'user-1',
        administeredComplexes: [
          { id: 'complex-1', name: 'Complex A' },
          { id: 'complex-2', name: 'Complex B' },
        ],
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const tenantDb = mockPrismaService.getTenantDB();
      tenantDb.property.count.mockResolvedValueOnce(10).mockResolvedValueOnce(20);
      tenantDb.resident.count.mockResolvedValueOnce(30).mockResolvedValueOnce(40);
      tenantDb.fee.aggregate.mockResolvedValueOnce({ _sum: { amount: 1000 } }).mockResolvedValueOnce({ _sum: { amount: 2000 } });
      tenantDb.pqr.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);

      const result = await service.getConsolidatedMetrics('user-1');

      expect(result.totalProperties).toBe(30);
      expect(result.totalResidents).toBe(70);
      expect(result.totalPendingFees).toBe(3000);
      expect(result.totalOpenPqrs).toBe(7);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getConsolidatedMetrics('user-nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMetricsByComplex', () => {
    it('should return an array of metrics for each complex', async () => {
        const mockUser = {
            id: 'user-1',
            administeredComplexes: [
              { id: 'complex-1', name: 'Complex A' },
              { id: 'complex-2', name: 'Complex B' },
            ],
          };
        prisma.user.findUnique.mockResolvedValue(mockUser);

        const tenantDb = mockPrismaService.getTenantDB();
        tenantDb.property.count.mockResolvedValueOnce(10).mockResolvedValueOnce(20);
        tenantDb.resident.count.mockResolvedValueOnce(30).mockResolvedValueOnce(40);
        tenantDb.fee.aggregate.mockResolvedValueOnce({ _sum: { amount: 1000 } }).mockResolvedValueOnce({ _sum: { amount: 2000 } });
        tenantDb.pqr.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);

        const result = await service.getMetricsByComplex('user-1');

        expect(result).toHaveLength(2);
        expect(result[0].complexName).toBe('Complex A');
        expect(result[0].totalProperties).toBe(10);
        expect(result[1].complexName).toBe('Complex B');
        expect(result[1].totalPendingFees).toBe(2000);
      });
  });
});
