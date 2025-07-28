import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
} from '../common/dto/payment-gateways.dto.js';