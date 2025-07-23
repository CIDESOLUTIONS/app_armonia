import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PlansService', () => {
  let service: PlansService;
  let prisma: PrismaService;

  // Mock the PrismaService to return mock clients for each model
  const mockPrismaService = {
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
    // Add other Prisma models used by PlansService here if any
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Provide the mock PrismaService
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in PlansService
});
