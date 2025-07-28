import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import { PackagesService } from './packages.service.js';
import {
  RegisterPackageDto,
  UpdatePackageDto,
  PackageDto,
  PackageFilterParamsDto,
} from '../common/dto/packages.dto.js';
