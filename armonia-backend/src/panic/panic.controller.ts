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
import { PanicService } from './panic.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  CreatePanicAlertDto,
  UpdatePanicAlertDto,
  CreatePanicResponseDto,
} from '../common/dto/panic.dto.js';
