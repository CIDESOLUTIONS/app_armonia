import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePersonalTransactionDto,
  UpdatePersonalTransactionDto,
  PersonalTransactionDto,
  PersonalTransactionFilterParamsDto,
} from '../common/dto/personal-finances.dto';