import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
} from '../common/dto/payment-gateways.dto.js';

@Injectable()
export class PaymentGatewaysService {
  constructor(private prisma: PrismaService) {}

  async createPaymentGateway(schemaName: string, data: CreatePaymentGatewayDto): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma;
    return prisma.paymentGatewayConfig.create({ data });
  }

  async getPaymentGateways(schemaName: string): Promise<PaymentGatewayConfigDto[]> {
    const prisma = this.prisma;
    return prisma.paymentGatewayConfig.findMany();
  }

  async getPaymentGatewayById(schemaName: string, id: number): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma;
    const gateway = await prisma.paymentGatewayConfig.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment gateway with ID ${id} not found.`);
    }
    return gateway;
  }

  async updatePaymentGateway(schemaName: string, id: number, data: UpdatePaymentGatewayDto): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma;
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    return prisma.paymentGatewayConfig.update({
      where: { id },
      data,
    });
  }

  async deletePaymentGateway(schemaName: string, id: number): Promise<void> {
    const prisma = this.prisma;
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    await prisma.paymentGatewayConfig.delete({ where: { id } });
  }
}
