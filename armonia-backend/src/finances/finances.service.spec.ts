import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from './finances.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { CommunicationsService } from '../communications/communications.service';
import { Logger } from '@nestjs/common';
import { vi } from 'vitest';

const mockPrismaClient = {
  fee: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
  },
  payment: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  budgetItem: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  invoice: {
    findUnique: vi.fn(),
  },
  bankTransaction: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  property: {
    findMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  paymentAttempt: {
    findFirst: vi.fn(),
  },
  paymentConfirmation: {
    findFirst: vi.fn(),
  },
};

describe('FinancesService', () => {
  let service: FinancesService;
  let prismaClientManager: PrismaClientManager;
  let notificationsService: NotificationsService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: vi.fn(() => mockPrismaClient),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyUser: vi.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            log: vi.fn(),
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
