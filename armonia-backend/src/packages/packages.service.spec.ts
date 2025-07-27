import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationsService } from '../communications/communications.service';

describe('PackagesService', () => {
  let service: PackagesService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              package: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
              },
              packageStatusHistory: { create: jest.fn() },
              packageNotification: { create: jest.fn() },
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            // Mock global PrismaService methods if needed
          },
        },
        {
          provide: CommunicationsService,
          useValue: {
            notifyUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in PackagesService
});