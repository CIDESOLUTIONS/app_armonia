import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommunicationsService } from '../communications/communications.service.js';

describe('PackagesService', () => {
  let service: PackagesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: PrismaService,
          useValue: {
            package: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            packageStatusHistory: { create: jest.fn() },
            packageNotification: { create: jest.fn() },
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

    service = testModule.get<PackagesService>(PackagesService);
    prisma = testModule.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in PackagesService
});
