import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto';

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
