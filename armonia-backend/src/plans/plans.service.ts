import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../common/dto/plans.dto';