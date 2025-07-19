import { Test, TestingModule } from '@nestjs/testing';
import { PqrService } from './pqr.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

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
            getClient: jest.fn().mockReturnValue({
              pQR: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
              },
              pQRStatusHistory: { create: jest.fn() },
              pQRComment: { create: jest.fn() },
              pQRAttachment: { create: jest.fn() },
              pQRNotification: { create: jest.fn() },
              pQRSLA: { findMany: jest.fn() },
              pQRTeam: { findMany: jest.fn() },
              pQRTeamMember: { create: jest.fn() },
              pQRAssignmentRule: { findMany: jest.fn() },
              pQRSettings: { findUnique: jest.fn() },
              pQRCustomCategory: { findMany: jest.fn() },
              pQRResponseTemplate: { findMany: jest.fn() },
              pQRReport: { create: jest.fn(), findMany: jest.fn() },
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
