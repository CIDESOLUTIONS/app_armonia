import { FinancesService } from './finances.service';
import { vi } from 'vitest';

// Mock dependencies
const mockPrismaClient = {
  fee: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
  payment: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  budget: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  bill: {
    findUnique: vi.fn(),
  },
  paymentAttempt: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  property: {
    findMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  paymentGateway: {
    findFirst: vi.fn(),
  },
  paymentMethod: {
    findFirst: vi.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: vi.fn(() => mockPrismaClient),
};

const mockPrismaService = {
  client: {
    user: {
      findUnique: vi.fn(),
    },
    residentialComplex: {
      findMany: vi.fn(),
    },
  },
};

const mockCommunicationService = {
  notifyUser: vi.fn(),
};

const mockPdfService = {
  generateFinancialReportPdf: vi.fn(),
};

vi.mock('@backend/lib/logging/server-logger', () => ({
  ServerLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@backend/lib/logging/activity-logger', () => ({
  ActivityLogger: {
    log: vi.fn(),
  },
}));

describe('FinancesService', () => {
  let service: FinancesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FinancesService(
      mockPrismaClientManager as any,
      mockPrismaService as any,
      mockCommunicationService as any,
      mockPdfService as any,
    );
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
      const mockFees = [{ id: 1, amount: 100, title: 'Fee 1', status: 'PENDING' }];
      mockPrismaClient.fee.findMany.mockResolvedValue(mockFees);
      mockPrismaClient.fee.count.mockResolvedValue(mockFees.length);

      const result = await service.getFees('test_schema', { status: 'PENDING' });

      expect(result.fees).toEqual(mockFees);
      expect(mockPrismaClient.fee.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle errors when fetching fees', async () => {
      mockPrismaClient.fee.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.getFees('test_schema', {})).rejects.toThrow('Error al obtener cuotas');
    });
  });

  describe('getFee', () => {
    it('should return a single fee by ID', async () => {
      const mockFee = { id: 1, amount: 100, title: 'Fee 1' };
      mockPrismaClient.fee.findUnique.mockResolvedValue(mockFee);

      const result = await service.getFee('test_schema', 1);

      expect(result).toEqual(mockFee);
      expect(mockPrismaClient.fee.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if fee not found', async () => {
      mockPrismaClient.fee.findUnique.mockResolvedValue(null);

      const result = await service.getFee('test_schema', 999);

      expect(result).toBeNull();
    });

    it('should handle errors when fetching a single fee', async () => {
      mockPrismaClient.fee.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.getFee('test_schema', 1)).rejects.toThrow('Error al obtener cuota');
    });
  });
});
