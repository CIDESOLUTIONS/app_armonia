import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

const mockPrismaClient = {
  plan: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  feature: {
    create: jest.fn(),
  },
  subscription: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: jest.fn(() => mockPrismaClient),
};

describe('PlansService', () => {
  let service: PlansService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: PrismaClientManager,
          useValue: mockPrismaClientManager, // Provide the mock PrismaClientManager
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in PlansService
});
