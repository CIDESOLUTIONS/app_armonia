import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  RegisterPackageDto,
  UpdatePackageDto,
  PackageDto,
  PackageFilterParamsDto,
  PackageStatus,
} from '../common/dto/packages.dto.js';
import { CommunicationsService } from '../communications/communications.service.js';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto.js';