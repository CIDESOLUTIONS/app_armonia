import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from './finances.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationsService } from '../communications/communications.service';
import { PaymentStatus } from '../common/dto/finances.dto';

// Mock dependencies
const mockPrismaClient = {
  fee: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
  },
  payment: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  budget: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  bill: {
    findUnique: jest.fn(),
  },
  paymentAttempt: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  paymentGateway: {
    findFirst: jest.fn(),
  },
  paymentMethod: {
    findFirst: jest.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: jest.fn(() => mockPrismaClient),
};

const mockPrismaService = {
  client: {
    user: {
      findUnique: jest.fn(),
    },
    residentialComplex: {
      findMany: jest.fn(),
    },
  },
};

const mockCommunicationService = {
  notifyUser: jest.fn(),
};

// No mockPdfService needed as it's not injected in the constructor

jest.mock('../lib/logging/server-logger', () => ({
  ServerLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../lib/logging/activity-logger', () => ({
  ActivityLogger: {
    log: jest.fn(),
  },
}));

describe('FinancesService', () => {
  let service: FinancesService;

  beforeEach(async () => {
    jest.clearAllMocks();
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
        {
          provide: CommunicationsService,
          useValue: mockCommunicationService,
        },
      ],
    }).compile();

    service = module.get<FinancesService>(FinancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFees', () => {
    it('should return a list of fees', async () => {
      const mockFees = [
        { id: 1, amount: 100, title: 'Fee 1' },
        { id: 2, amount: 200, title: 'Fee 2' },
      ];
      mockPrismaClient.fee.findMany.mockResolvedValue(mockFees);
      mockPrismaClient.fee.count.mockResolvedValue(mockFees.length);

      const result = await service.getFees('test_schema', {});

      expect(result.fees).toEqual(mockFees);
      expect(result.total).toBe(mockFees.length);
      expect(mockPrismaClient.fee.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter fees by status', async () => {
      const mockFees = [
        { id: 1, amount: 100, title: 'Fee 1', status: 'PENDING' },
      ];
      mockPrismaClient.fee.findMany.mockResolvedValue(mockFees);
      mockPrismaClient.fee.count.mockResolvedValue(mockFees.length);

      const result = await service.getFees('test_schema', {
        status: PaymentStatus.PENDING,
      });

      expect(result.fees).toEqual(mockFees);
      expect(mockPrismaClient.fee.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle errors when fetching fees', async () => {
      mockPrismaClient.fee.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getFees('test_schema', {})).rejects.toThrow(
        'Error al obtener cuotas',
      );
    });
  });

  describe('getFee', () => {
    it('should return a single fee by ID', async () => {
      const mockFee = { id: 1, amount: 100, title: 'Fee 1' };
      mockPrismaClient.fee.findUnique.mockResolvedValue(mockFee);

      const result = await service.getFee('test_schema', 1);

      expect(result).toEqual(mockFee);
      expect(mockPrismaClient.fee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if fee not found', async () => {
      mockPrismaClient.fee.findUnique.mockResolvedValue(null);

      const result = await service.getFee('test_schema', 999);

      expect(result).toBeNull();
    });

    it('should handle errors when fetching a single fee', async () => {
      mockPrismaClient.fee.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getFee('test_schema', 1)).rejects.toThrow(
        'Error al obtener cuota',
      );
    });
  });
});