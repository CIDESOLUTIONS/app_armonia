import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              property: {
                count: jest.fn().mockResolvedValue(10),
              },
              // Mockear otros modelos de Prisma según sea necesario
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return portfolio metrics', async () => {
    const metrics = await service.getPortfolioMetrics(1);
    expect(metrics).toBeDefined();
    expect(metrics.totalProperties).toBe(10);
  });

  it('should return complex metrics', async () => {
    const metrics = await service.getComplexMetrics(1);
    expect(metrics).toBeDefined();
    expect(metrics.length).toBeGreaterThan(0);
  });
});
