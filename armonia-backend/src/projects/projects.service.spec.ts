import '@test/jest-setup';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              project: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
              },
              projectTask: {
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
              },
              projectUpdate: { create: jest.fn(), findMany: jest.fn() },
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            // Mock global PrismaService methods if needed
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for each method in ProjectsService
});
