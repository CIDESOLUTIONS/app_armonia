import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { VisitorsService } from './visitors.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VisitorsService', () => {
  let service: VisitorsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorsService,
        {
          provide: PrismaService,
          useValue: {
            visitor: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            vehicle: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            invitation: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            accessLog: { create: jest.fn(), findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = testModule.get<VisitorsService>(VisitorsService);
    prisma = testModule.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in VisitorsService
});
