import { Test, TestingModule } from '@nestjs/testing';
import { PqrService } from './pqr.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { vi } from 'vitest';

describe('PqrService', () => {
  let service: PqrService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PqrService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: vi.fn().mockReturnValue({
              pQR: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
              pQRStatusHistory: { create: vi.fn() },
              pQRComment: { create: vi.fn() },
              pQRAttachment: { create: vi.fn() },
              pQRNotification: { create: vi.fn() },
              pQRSLA: { findMany: vi.fn() },
              pQRTeam: { findMany: vi.fn() },
              pQRTeamMember: { create: vi.fn() },
              pQRAssignmentRule: { findMany: vi.fn() },
              pQRSettings: { findUnique: vi.fn() },
              pQRCustomCategory: { findMany: vi.fn() },
              pQRResponseTemplate: { findMany: vi.fn() },
              pQRReport: { create: vi.fn(), findMany: vi.fn() },
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            // Mock global PrismaService methods if needed
          },
        },
      ],
    }).compile();

    service = module.get<PqrService>(PqrService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in PqrService
});
