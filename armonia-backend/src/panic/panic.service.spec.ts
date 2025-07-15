import { Test, TestingModule } from '@nestjs/testing';
import { PanicService } from './panic.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePanicAlertDto, PanicStatus } from '../common/dto/panic.dto';

describe('PanicService', () => {
  let service: PanicService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PanicService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              panicAlert: {
                create: jest.fn().mockResolvedValue({ id: 1, status: PanicStatus.ACTIVE }),
                findMany: jest.fn().mockResolvedValue([
                  { id: 1, status: PanicStatus.ACTIVE },
                  { id: 2, status: PanicStatus.ACTIVE },
                ]),
                findUnique: jest.fn().mockResolvedValue({ id: 1, status: PanicStatus.ACTIVE }),
                update: jest.fn().mockResolvedValue({ id: 1, status: PanicStatus.RESOLVED }),
              },
            }),
          },
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<PanicService>(PanicService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a panic alert', async () => {
    const createDto: CreatePanicAlertDto = {
      userId: 1,
      propertyId: 1,
      location: 'Apto 101',
      message: 'Incendio',
    };
    const alert = await service.createPanicAlert('test_schema', createDto);
    expect(alert).toBeDefined();
    expect(alert.status).toBe(PanicStatus.ACTIVE);
  });

  it('should get active panic alerts', async () => {
    const alerts = await service.getActivePanicAlerts('test_schema');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('should update panic alert status', async () => {
    const updatedAlert = await service.updatePanicAlertStatus('test_schema', 1, { status: PanicStatus.RESOLVED });
    expect(updatedAlert.status).toBe(PanicStatus.RESOLVED);
  });
});
