import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
} from '../common/dto/payment-gateways.dto';

@Injectable()
export class PaymentGatewaysService {
  constructor(private prisma: PrismaService) {}

  async createPaymentGateway(
    schemaName: string,
    data: CreatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.paymentGatewayConfig.create({ data });
  }

  async getPaymentGateways(
    schemaName: string,
  ): Promise<PaymentGatewayConfigDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.paymentGatewayConfig.findMany();
  }

  async getPaymentGatewayById(
    schemaName: string,
    id: string,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const gateway = await prisma.paymentGatewayConfig.findUnique({
      where: { id },
    });
    if (!gateway) {
      throw new NotFoundException(`Payment gateway with ID ${id} not found.`);
    }
    return gateway;
  }

  async updatePaymentGateway(
    schemaName: string,
    id: string,
    data: UpdatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    return prisma.paymentGatewayConfig.update({
      where: { id },
      data,
    });
  }

  async deletePaymentGateway(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    await prisma.paymentGatewayConfig.delete({ where: { id } });
  }
}