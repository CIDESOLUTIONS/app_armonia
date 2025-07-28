import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto.js';