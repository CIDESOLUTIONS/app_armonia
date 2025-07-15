import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from '../finances.service';
import { PrismaClientManager } from '../../prisma/prisma-client-manager';
import { PrismaService } from '../../prisma/prisma.service';

describe('FinancesService - Bank Reconciliation', () => {
  let service: FinancesService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              payment: {
                findFirst: jest.fn().mockResolvedValue(null), // Mockear para simular no coincidencia
              },
            }),
          },
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<FinancesService>(FinancesService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process bank statement and return suggestions', async () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'bank_statement.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      size: 1024,
      buffer: Buffer.from('date,description,amount\n2025-07-01,Test Transaction,100.00'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };

    const suggestions = await service.processBankStatement('test_schema', mockFile);
    expect(suggestions).toBeDefined();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].status).toBe('UNMATCHED');
  });
});
