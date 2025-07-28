import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto';