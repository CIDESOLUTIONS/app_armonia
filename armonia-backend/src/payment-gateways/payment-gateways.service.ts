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

  private mapToPaymentGatewayConfigDto(gateway: any): PaymentGatewayConfigDto {
    return {
      id: gateway.id,
      name: gateway.name,
      config: gateway.config,
      isActive: gateway.isActive,
      createdAt: gateway.createdAt,
      updatedAt: gateway.updatedAt,
    };
  }

  async createPaymentGateway(
    schemaName: string,
    data: CreatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const gateway = await prisma.paymentGatewayConfig.create({
      data: {
        name: data.name,
        config: data.config,
        isActive: data.isActive,
      },
    });
    return this.mapToPaymentGatewayConfigDto(gateway);
  }

  async getPaymentGateways(
    schemaName: string,
  ): Promise<PaymentGatewayConfigDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const gateways = await prisma.paymentGatewayConfig.findMany();
    return gateways.map(this.mapToPaymentGatewayConfigDto);
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
    return this.mapToPaymentGatewayConfigDto(gateway);
  }

  async updatePaymentGateway(
    schemaName: string,
    id: string,
    data: UpdatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    const updatedGateway = await prisma.paymentGatewayConfig.update({
      where: { id },
      data: {
        name: data.name,
        config: data.config,
        isActive: data.isActive,
      },
    });
    return this.mapToPaymentGatewayConfigDto(updatedGateway);
  }

  async deletePaymentGateway(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    await prisma.paymentGatewayConfig.delete({ where: { id } });
  }
}