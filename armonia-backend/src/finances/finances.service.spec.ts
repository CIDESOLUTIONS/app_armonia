import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from './finances.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { CommunicationsService } from '../communications/communications.service';
import { Logger } from '@nestjs/common';

const mockPrismaClient = {
  fee: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
  },
  payment: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  budgetItem: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  invoice: {
    findUnique: jest.fn(),
  },
  bankTransaction: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  paymentAttempt: {
    findFirst: jest.fn(),
  },
  paymentConfirmation: {
    findFirst: jest.fn(),
  },
};

describe('FinancesService', () => {
  let service: FinancesService;
  let prismaClientManager: PrismaClientManager;
  let communicationsService: CommunicationsService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn(() => mockPrismaClient),
          },
        },
        {
          provide: CommunicationsService,
          useValue: {
            notifyUser: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FinancesService>(FinancesService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
    communicationsService = module.get<CommunicationsService>(CommunicationsService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here
});