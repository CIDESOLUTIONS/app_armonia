import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyService } from './assembly.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssemblyDto, AssemblyStatus, AssemblyType } from '../common/dto/assembly.dto';

describe('AssemblyService', () => {
  let service: AssemblyService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssemblyService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              assembly: {
                create: jest.fn().mockResolvedValue({ id: 1, title: 'Test Assembly', status: AssemblyStatus.SCHEDULED }),
                findMany: jest.fn().mockResolvedValue([
                  { id: 1, title: 'Assembly 1', status: AssemblyStatus.SCHEDULED },
                  { id: 2, title: 'Assembly 2', status: AssemblyStatus.COMPLETED },
                ]),
                findUnique: jest.fn().mockResolvedValue({ id: 1, title: 'Test Assembly', status: AssemblyStatus.SCHEDULED }),
                update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Assembly', status: AssemblyStatus.COMPLETED }),
                delete: jest.fn().mockResolvedValue(undefined),
              },
              vote: {
                create: jest.fn().mockResolvedValue({ id: 1, question: 'Test Vote' }),
              },
              userVote: {
                create: jest.fn().mockResolvedValue({ id: 1, userId: 1, voteId: 1 }),
              },
            }),
          },
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<AssemblyService>(AssemblyService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an assembly', async () => {
    const createDto: CreateAssemblyDto = {
      title: 'Asamblea de Prueba',
      description: 'Descripción de la asamblea',
      scheduledDate: new Date().toISOString(),
      location: 'Salón Comunal',
      type: AssemblyType.ORDINARY,
      agenda: 'Punto 1, Punto 2',
    };
    const assembly = await service.createAssembly('test_schema', createDto);
    expect(assembly).toBeDefined();
    expect(assembly.title).toBe('Test Assembly');
  });

  it('should get assemblies', async () => {
    const assemblies = await service.getAssemblies('test_schema');
    expect(assemblies.length).toBeGreaterThan(0);
  });

  it('should register attendance', async () => {
    const result = await service.registerAttendance('test_schema', 1, 1, true);
    expect(result.message).toBe('Asistencia registrada');
  });

  it('should create a vote', async () => {
    const vote = await service.createVote('test_schema', { assemblyId: 1, question: 'Test Question', options: ['A', 'B'], isWeighted: false });
    expect(vote).toBeDefined();
    expect(vote.question).toBe('Test Vote');
  });

  it('should submit a vote', async () => {
    const vote = await service.submitVote('test_schema', { voteId: 1, optionIndex: 0, userId: 1 });
    expect(vote).toBeDefined();
    expect(vote.userId).toBe(1);
  });
});
