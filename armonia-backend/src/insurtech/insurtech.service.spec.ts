import { Test, TestingModule } from '@nestjs/testing';
import { InsurtechService } from './insurtech.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InsuranceQuoteRequestDto, InsuranceType } from '../common/dto/fintech-insurtech.dto';

const mockPrismaService = {
  getTenantDB: jest.fn().mockReturnValue({
    user: {
      findUnique: jest.fn(),
    },
    insuranceQuote: {
      create: jest.fn(),
    },
  }),
};

describe('InsurtechService', () => {
  let service: InsurtechService;
  let prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsurtechService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InsurtechService>(InsurtechService);
    prisma = mockPrismaService.getTenantDB('test-schema');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInsuranceQuote', () => {
    const userId = 'user-1';
    const quoteRequest: InsuranceQuoteRequestDto = {
      insuranceType: InsuranceType.HOME,
      coverageDetails: { coverageAmount: 200000000 },
    };
    const mockUser = { id: userId, residentialComplexId: 'complex-1' };

    it('should return an array of quotes for a valid request', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.insuranceQuote.create.mockImplementation(async (args) => ({ ...args.data, id: 'quote-123' }));

      const result = await service.getInsuranceQuote('test-schema', userId, quoteRequest);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prisma.insuranceQuote.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].premium).toBeGreaterThan(0);
      expect(result[0].provider).toBeDefined();
    });

    it('should throw NotFoundException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getInsuranceQuote('test-schema', 'unknown-user', quoteRequest)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no providers return quotes', async () => {
        // Mock the private method to simulate no providers
        jest.spyOn(service as any, 'getAvailableProviders').mockResolvedValue([]);
        prisma.user.findUnique.mockResolvedValue(mockUser);
  
        await expect(service.getInsuranceQuote('test-schema', userId, quoteRequest)).rejects.toThrow(BadRequestException);
      });

    it('should calculate a base premium based on coverage amount', () => {
        const calculatedPremium = (service as any).calculateBasePremium(InsuranceType.HOME, 100000);
        // 100000 * 0.004 = 400
        expect(calculatedPremium).toBe(400);
    });
  });
});
