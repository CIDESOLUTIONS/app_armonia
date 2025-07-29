import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserManagementService } from './user-management.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../common/dto/user-management.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('staff')
  getStaffUsers(@GetUser() user: any) {
    return this.userManagementService.getStaffUsers(user.schemaName);
  }

  @Post('staff')
  createStaffUser(@GetUser() user: any, @Body() createUserDto: CreateUserDto) {
    return this.userManagementService.createStaffUser(
      user.schemaName,
      user.complexId,
      createUserDto,
    );
  }

  @Put('staff/:id')
  updateStaffUser(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userManagementService.updateStaffUser(
      user.schemaName,
      +id,
      updateUserDto,
    );
  }

  @Delete('staff/:id')
  deleteStaffUser(@GetUser() user: any, @Param('id') id: string) {
    return this.userManagementService.deleteStaffUser(user.schemaName, +id);
  }
}
