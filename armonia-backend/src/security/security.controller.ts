import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto.js';