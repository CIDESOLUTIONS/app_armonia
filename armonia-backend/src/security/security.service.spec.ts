import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { vi } from 'vitest';

describe('SecurityService', () => {
  let service: SecurityService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: vi.fn().mockReturnValue({
              securityLog: { create: vi.fn(), findMany: vi.fn() },
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            accessAttempt: { create: vi.fn(), findMany: vi.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in SecurityService
});
