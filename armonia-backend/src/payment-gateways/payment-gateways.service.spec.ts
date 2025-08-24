import { Test, TestingModule } from '@nestjs/testing';
import { PaymentGatewaysService } from './payment-gateways.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProcessingService } from './payment-processing.service';
import { WebhookService } from './webhook.service';
import { StripeService } from './integrations/stripe.service';
import { PayPalService } from './integrations/paypal.service';
import { PSEService } from './integrations/pse.service';
import { CreatePaymentGatewayDto, UpdatePaymentGatewayDto, PaymentGatewayType } from '../common/dto/payment-gateways.dto';
import { NotFoundException } from '@nestjs/common';

// Mock de los servicios dependientes
const mockPrismaService = {
  getTenantDB: jest.fn().mockReturnValue({
    paymentGatewayConfig: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }),
};

const mockPaymentProcessingService = {};
const mockWebhookService = {};
const mockStripeService = {};
const mockPayPalService = {};
const mockPSEService = {};

describe('PaymentGatewaysService', () => {
  let service: PaymentGatewaysService;
  let prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentGatewaysService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaymentProcessingService, useValue: mockPaymentProcessingService },
        { provide: WebhookService, useValue: mockWebhookService },
        { provide: StripeService, useValue: mockStripeService },
        { provide: PayPalService, useValue: mockPayPalService },
        { provide: PSEService, useValue: mockPSEService },
      ],
    }).compile();

    service = module.get<PaymentGatewaysService>(PaymentGatewaysService);
    prisma = mockPrismaService.getTenantDB('test-schema');

    // Mock de los métodos de encriptación para que no dependan de la clave real
    jest.spyOn(service as any, 'encryptSensitiveData').mockImplementation((data) => `encrypted_${data}`);
    jest.spyOn(service as any, 'maskSensitiveData').mockImplementation((data) => `masked_${data}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentGateway', () => {
    it('should create a payment gateway with all fields', async () => {
      const dto: CreatePaymentGatewayDto = {
        name: 'Test Stripe',
        type: PaymentGatewayType.STRIPE,
        apiKey: 'test_api_key',
        secretKey: 'test_secret_key',
        isActive: true,
        testMode: true,
        webhookUrl: 'https://test.com/webhook',
        supportedCurrencies: ['USD', 'COP'],
      };

      const expectedGateway = {
        id: 'some-cuid',
        ...dto,
        residentialComplexId: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.paymentGatewayConfig.create.mockResolvedValue(expectedGateway);

      const result = await service.createPaymentGateway('test-schema', dto);

      expect(prisma.paymentGatewayConfig.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          type: dto.type,
          apiKey: 'encrypted_test_api_key',
          secretKey: 'encrypted_test_secret_key',
          webhookSecret: undefined,
          merchantId: undefined,
          environment: 'test',
          supportedCurrencies: dto.supportedCurrencies,
          supportedMethods: [],
          isActive: dto.isActive,
          testMode: dto.testMode,
          webhookUrl: dto.webhookUrl,
          maxAmount: undefined,
          minAmount: undefined,
          commissionRate: 0,
          fixedCommission: 0,
          residentialComplexId: 'default',
        },
      });

      expect(result).toBeDefined();
      expect(result.name).toEqual(dto.name);
      expect(result.apiKey).toEqual('masked_encrypted_test_api_key'); // Verifica que se enmascare
      expect(result.testMode).toBe(true);
      expect(result.webhookUrl).toBe(dto.webhookUrl);
    });
  });

  describe('getPaymentGateways', () => {
    it('should return a list of gateways', async () => {
      const gateways = [{ id: '1', name: 'Gateway 1' }, { id: '2', name: 'Gateway 2' }];
      prisma.paymentGatewayConfig.findMany.mockResolvedValue(gateways);

      const result = await service.getPaymentGateways('test-schema');
      expect(result).toHaveLength(2);
      expect(prisma.paymentGatewayConfig.findMany).toHaveBeenCalled();
    });
  });

  describe('getPaymentGatewayById', () => {
    it('should return a gateway if found', async () => {
      const gateway = { id: '1', name: 'Test Gateway' };
      prisma.paymentGatewayConfig.findUnique.mockResolvedValue(gateway);

      const result = await service.getPaymentGatewayById('test-schema', '1');
      expect(result).toBeDefined();
      expect(prisma.paymentGatewayConfig.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if gateway not found', async () => {
      prisma.paymentGatewayConfig.findUnique.mockResolvedValue(null);

      await expect(service.getPaymentGatewayById('test-schema', '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePaymentGateway', () => {
    it('should update a gateway', async () => {
      const dto: UpdatePaymentGatewayDto = { name: 'Updated Name', isActive: false };
      const existingGateway = { id: '1', name: 'Old Name', isActive: true };

      prisma.paymentGatewayConfig.findUnique.mockResolvedValue(existingGateway);
      prisma.paymentGatewayConfig.update.mockResolvedValue({ ...existingGateway, ...dto });

      const result = await service.updatePaymentGateway('test-schema', '1', dto);

      expect(prisma.paymentGatewayConfig.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
      expect(result.name).toEqual('Updated Name');
      expect(result.isActive).toBe(false);
    });

    it('should encrypt sensitive fields on update', async () => {
        const dto: UpdatePaymentGatewayDto = { apiKey: 'new_key' };
        const existingGateway = { id: '1', name: 'Test' };
  
        prisma.paymentGatewayConfig.findUnique.mockResolvedValue(existingGateway);
        prisma.paymentGatewayConfig.update.mockResolvedValue(existingGateway);
  
        await service.updatePaymentGateway('test-schema', '1', dto);
  
        expect(prisma.paymentGatewayConfig.update).toHaveBeenCalledWith({
          where: { id: '1' },
          data: { apiKey: 'encrypted_new_key' },
        });
      });
  });

  describe('deletePaymentGateway', () => {
    it('should delete a gateway', async () => {
      const existingGateway = { id: '1', name: 'Test Gateway' };
      prisma.paymentGatewayConfig.findUnique.mockResolvedValue(existingGateway);
      prisma.paymentGatewayConfig.delete.mockResolvedValue(existingGateway);

      await service.deletePaymentGateway('test-schema', '1');

      expect(prisma.paymentGatewayConfig.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if gateway to delete is not found', async () => {
        prisma.paymentGatewayConfig.findUnique.mockResolvedValue(null);
        await expect(service.deletePaymentGateway('test-schema', '999')).rejects.toThrow(NotFoundException);
      });
  });
});
