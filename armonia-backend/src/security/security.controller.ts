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

@UseGuards(
  JwtAuthGuard,
  RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN, UserRole.SECURITY]),
)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('events')
  createSecurityEvent(
    @GetUser() user: any,
    @Body() createSecurityEventDto: CreateSecurityEventDto,
  ) {
    return this.securityService.createSecurityEvent(
      user.schemaName,
      createSecurityEventDto,
    );
  }

  @Get('events')
  getSecurityEvents(@GetUser() user: any, @Query() filters: any) {
    return this.securityService.getSecurityEvents(user.schemaName, filters);
  }

  @Post('access-attempts')
  createAccessAttempt(
    @GetUser() user: any,
    @Body() createAccessAttemptDto: CreateAccessAttemptDto,
  ) {
    return this.securityService.createAccessAttempt(
      user.schemaName,
      createAccessAttemptDto,
    );
  }

  @Get('access-attempts')
  getAccessAttempts(@GetUser() user: any, @Query() filters: any) {
    return this.securityService.getAccessAttempts(user.schemaName, filters);
  }
}
