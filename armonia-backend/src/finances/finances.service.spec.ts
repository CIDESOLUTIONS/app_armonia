import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from './finances.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationService } from '../communications/communications.service';
import { PdfService } from '../common/services/pdf.service';
import { vi } from 'vitest';

describe('FinancesService', () => {
  let service: FinancesService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;
  let communicationService: CommunicationService;
  let pdfService: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: vi.fn().mockReturnValue({
              fee: { findMany: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), aggregate: vi.fn() },
              payment: { findMany: vi.fn(), create: vi.fn(), aggregate: vi.fn() },
              budget: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
              bill: { findUnique: vi.fn() },
              paymentAttempt: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
              property: { findMany: vi.fn() },
              user: { findUnique: vi.fn() },
              paymentGateway: { findFirst: vi.fn() },
              paymentMethod: { findFirst: vi.fn() },
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            client: {
              user: { findUnique: vi.fn() },
              residentialComplex: { findMany: vi.fn() },
            },
          },
        },
        {
          provide: CommunicationService,
          useValue: {
            notifyUser: vi.fn(),
          },
        },
        {
          provide: PdfService,
          useValue: {
            generateFinancialReportPdf: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FinancesService>(FinancesService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
    communicationService = module.get<CommunicationService>(CommunicationService);
    pdfService = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in FinancesService
});
