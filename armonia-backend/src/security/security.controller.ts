import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateSecurityLogDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto';

@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('log')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN, UserRole.STAFF)
  async createSecurityLog(@GetUser() user: any, @Body() createSecurityLogDto: CreateSecurityLogDto) {
    return this.securityService.createSecurityLog(user.schemaName, createSecurityLogDto);
  }

  @Get('log')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async getSecurityLogs(@GetUser() user: any, @Query() filters: any) {
    return this.securityService.getSecurityLogs(user.schemaName, filters);
  }

  @Post('access-attempt')
  async createAccessAttempt(@Body() createAccessAttemptDto: CreateAccessAttemptDto) {
    return this.securityService.createAccessAttempt(createAccessAttemptDto);
  }

  @Get('access-attempt')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async getAccessAttempts(@Query() filters: any) {
    return this.securityService.getAccessAttempts(filters);
  }
}