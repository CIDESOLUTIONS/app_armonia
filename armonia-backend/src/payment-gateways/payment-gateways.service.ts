import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
} from '../common/dto/payment-gateways.dto';

@Injectable()
export class PaymentGatewaysService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createPaymentGateway(
    schemaName: string,
    data: CreatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma;
    return prisma.paymentGateway.create({ data });
  }

  async getPaymentGateways(
    schemaName: string,
  ): Promise<PaymentGatewayConfigDto[]> {
    const prisma = this.prisma;
    return prisma.paymentGateway.findMany();
  }

  async getPaymentGatewayById(
    schemaName: string,
    id: number,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma;
    const gateway = await prisma.paymentGateway.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment Gateway with ID ${id} no encontrado`);
    }
    return gateway;
  }

  async updatePaymentGateway(
    schemaName: string,
    id: number,
    data: UpdatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma;
    const gateway = await prisma.paymentGateway.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment Gateway with ID ${id} no encontrado`);
    }
    return prisma.paymentGateway.update({ where: { id }, data });
  }

  async deletePaymentGateway(schemaName: string, id: number): Promise<void> {
    const prisma = this.prisma;
    const gateway = await prisma.paymentGateway.findUnique({ where: { id } });
    if (!gateway) {
      throw new NotFoundException(`Payment Gateway with ID ${id} no encontrado`);
    }
    await prisma.paymentGateway.delete({ where: { id } });
  }
}