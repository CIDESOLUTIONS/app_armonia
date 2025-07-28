import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterPackageDto,
  UpdatePackageDto,
  PackageDto,
  PackageFilterParamsDto,
  PackageStatus,
} from '../common/dto/packages.dto';
import { CommunicationsService } from '../communications/communications.service';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto';