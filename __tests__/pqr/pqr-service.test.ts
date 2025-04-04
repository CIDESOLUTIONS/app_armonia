import { PQRService } from '@/lib/pqr/pqr-service';
import { prisma } from '@/lib/prisma';
import { NotificationService } from '@/lib/notifications/notification-service';
import { ActivityLogger } from '@/lib/logging/activity-logger';

// Mocks
jest.mock('@/lib/prisma', () => ({
  prisma: {
    pqR: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn()
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

jest.mock('@/lib/notifications/notification-service', () => ({
  NotificationService: {
    notifyPQRCreation: jest.fn(),
    notifyPQRStatusChange: jest.fn()
  }
}));

jest.mock('@/lib/logging/activity-logger', () => ({
  ActivityLogger: {
    log: jest.fn()
  }
}));

describe('PQRService', () => {
  const mockUser = {
    id: 1,
    role: 'RESIDENT',
    complexId: 100
  };

  const mockPQRData = {
    type: 'COMPLAINT',
    title: 'Test PQR',
    description: 'This is a test PQR description',
    priority: 'MEDIUM',
    userId: 1,
    complexId: 100
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPQR', () => {
    it('should create a PQR successfully', async () => {
      // Mock successful PQR creation
      (prisma.pqR.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockPQRData
      });

      const result = await PQRService.createPQR(mockPQRData, mockUser);

      expect(prisma.pqR.create).toHaveBeenCalledWith({
        data: {
          ...mockPQRData,
          userId: mockUser.id
        }
      });
      expect(NotificationService.notifyPQRCreation).toHaveBeenCalled();
      expect(ActivityLogger.log).toHaveBeenCalled();
      expect(result).toMatchObject(mockPQRData);
    });

    it('should throw error for invalid PQR data', async () => {
      const invalidPQRData = {
        ...mockPQRData,
        title: '', // Invalid title
      };

      await expect(
        PQRService.createPQR(invalidPQRData, mockUser)
      ).rejects.toThrow('El título debe tener al menos 5 caracteres');
    });
  });

  describe('updatePQR', () => {
    const existingPQR = {
      id: 1,
      userId: 1,
      complexId: 100,
      status: 'OPEN',
      user: mockUser
    };

    it('should update PQR successfully', async () => {
      // Mock finding existing PQR
      (prisma.pqR.findUnique as jest.Mock).mockResolvedValue(existingPQR);
      
      // Mock PQR update
      (prisma.pqR.update as jest.Mock).mockResolvedValue({
        ...existingPQR,
        status: 'IN_PROGRESS'
      });

      const result = await PQRService.updatePQR(
        1, 
        { status: 'IN_PROGRESS' }, 
        mockUser
      );

      expect(prisma.pqR.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          status: 'IN_PROGRESS'
        })
      });
      expect(NotificationService.notifyPQRStatusChange).toHaveBeenCalled();
      expect(ActivityLogger.log).toHaveBeenCalled();
    });

    it('should prevent updating closed PQR', async () => {
      const closedPQR = {
        ...existingPQR,
        status: 'CLOSED'
      };

      (prisma.pqR.findUnique as jest.Mock).mockResolvedValue(closedPQR);

      await expect(
        PQRService.updatePQR(
          1, 
          { status: 'IN_PROGRESS' }, 
          { ...mockUser, role: 'RESIDENT' }
        )
      ).rejects.toThrow('No se pueden modificar PQRs cerradas');
    });
  });

  describe('getPQRs', () => {
    it('should retrieve PQRs with appropriate filters', async () => {
      const mockPQRs = [
        { id: 1, ...mockPQRData },
        { id: 2, ...mockPQRData }
      ];

      (prisma.pqR.findMany as jest.Mock).mockResolvedValue(mockPQRs);

      const result = await PQRService.getPQRs(mockUser, {
        status: 'OPEN',
        type: 'COMPLAINT'
      });

      expect(prisma.pqR.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            complexId: mockUser.complexId,
            status: 'OPEN',
            type: 'COMPLAINT',
            userId: mockUser.id
          })
        })
      );
      expect(result).toEqual(mockPQRs);
    });
  });

  describe('getPQRStats', () => {
    it('should retrieve PQR statistics', async () => {
      (prisma.pqR.count as jest.Mock).mockResolvedValue(10);
      (prisma.pqR.groupBy as jest.Mock)
        .mockReturnValueOnce([{ status: 'OPEN', _count: { status: 5 } }])
        .mockReturnValueOnce([{ priority: 'HIGH', _count: { priority: 3 } }]);

      const result = await PQRService.getPQRStats(mockUser.complexId);

      expect(result).toEqual({
        total: 10,
        byStatus: { OPEN: 5 },
        byPriority: { HIGH: 3 }
      });
    });
  });
});
