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
import { UserManagementService } from './user-management.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../common/dto/user-management.dto';

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
