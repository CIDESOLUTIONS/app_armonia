import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('TenantService', () => {
  let service: TenantService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: PrismaService,
          useValue: {
            residentialComplex: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in TenantService
});