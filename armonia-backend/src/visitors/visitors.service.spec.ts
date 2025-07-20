import { Test, TestingModule } from '@nestjs/testing';
import { VisitorsService } from './visitors.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { vi } from 'vitest';

describe('VisitorsService', () => {
  let service: VisitorsService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorsService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: vi.fn().mockReturnValue({
              visitor: {
                create: vi.fn(),
                findMany: vi.fn(),
                findUnique: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
              },
              preRegisteredVisitor: {
                create: vi.fn(),
                findMany: vi.fn(),
                findUnique: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
              },
              accessPass: {
                create: vi.fn(),
                findMany: vi.fn(),
                findUnique: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
              },
              accessLog: { create: vi.fn(), findMany: vi.fn() },
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

    service = module.get<VisitorsService>(VisitorsService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in VisitorsService
});
