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
import { PqrService } from './pqr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  PQRDto,
  GetPQRParamsDto,
  CreatePQRDto,
  UpdatePQRDto,
  PQRCommentDto,
} from '../common/dto/pqr.dto';
