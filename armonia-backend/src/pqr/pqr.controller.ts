import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { PqrService } from './pqr.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  PQRDto,
  GetPQRParamsDto,
  CreatePQRDto,
  UpdatePQRDto,
  PQRCommentDto,
} from '../common/dto/pqr.dto.js';
