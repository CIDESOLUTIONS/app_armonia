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
import { PanicService } from './panic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreatePanicAlertDto,
  UpdatePanicAlertDto,
  CreatePanicResponseDto,
} from '../common/dto/panic.dto';
