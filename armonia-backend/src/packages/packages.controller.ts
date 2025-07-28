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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { PackagesService } from './packages.service';
import {
  RegisterPackageDto,
  UpdatePackageDto,
  PackageDto,
  PackageFilterParamsDto,
} from '../common/dto/packages.dto';
