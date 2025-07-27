import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { PqrService } from './pqr.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PqrService', () => {
  let service: PqrService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PqrService,
        {
          provide: PrismaService,
          useValue: {
            pQR: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            pQRStatusHistory: { create: jest.fn() },
            pQRComment: { create: jest.fn() },
            pQRAttachment: { create: jest.fn() },
            pQRNotification: { create: jest.fn() },
            pQRSLA: { findMany: jest.fn() },
            pQRTeam: { findMany: jest.fn() },
            pQRTeamMember: { create: jest.fn() },
            pQRAssignmentRule: { findMany: jest.fn() },
            pQRSettings: { findUnique: jest.fn() },
            pQRCustomCategory: { findMany: jest.fn() },
            pQRResponseTemplate: { findMany: jest.fn() },
            pQRReport: { create: jest.fn(), findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<PqrService>(PqrService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in PqrService
});