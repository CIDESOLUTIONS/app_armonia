import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
} from '../common/dto/payment-gateways.dto';

@Injectable()
export class PaymentGatewaysService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createPaymentGateway(
    schemaName: string,
    data: CreatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.paymentGateway.create({ data });
  }

  async getPaymentGateways(
    schemaName: string,
  ): Promise<PaymentGatewayConfigDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.paymentGateway.findMany();
  }

  async getPaymentGatewayById(
    schemaName: string,
    id: number,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const gateway = await prisma.paymentGateway.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment Gateway with ID ${id} not found`);
    }
    return gateway;
  }

  async updatePaymentGateway(
    schemaName: string,
    id: number,
    data: UpdatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const gateway = await prisma.paymentGateway.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment Gateway with ID ${id} not found`);
    }
    return prisma.paymentGateway.update({ where: { id }, data });
  }

  async deletePaymentGateway(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const gateway = await prisma.paymentGateway.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment Gateway with ID ${id} not found`);
    }
    await prisma.paymentGateway.delete({ where: { id } });
  }
}
