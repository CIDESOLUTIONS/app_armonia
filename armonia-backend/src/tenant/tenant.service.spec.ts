import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

describe('TenantService', () => {
  let service: TenantService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn(() => ({
              residentialComplex: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in TenantService
});
