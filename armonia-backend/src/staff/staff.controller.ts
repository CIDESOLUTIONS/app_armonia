import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import { CreateUserDto, UpdateUserDto } from '../common/dto/user.dto'; // Assuming these DTOs exist

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
@Controller('staff')
export class StaffController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createStaffUser(@GetUser() user: any, @Body() createUserDto: CreateUserDto) {
    // Ensure the role is STAFF when creating via this endpoint
    if (createUserDto.role && createUserDto.role !== UserRole.STAFF) {
      throw new Error('Only STAFF role can be created via this endpoint.');
    }
    return this.userService.createUser(user.schemaName, { ...createUserDto, role: UserRole.STAFF });
  }

  @Get()
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async findAllStaffUsers(@GetUser() user: any) {
    return this.userService.findAllUsers(user.schemaName, UserRole.STAFF);
  }

  @Get(':id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async findOneStaffUser(@GetUser() user: any, @Param('id') id: string) {
    const staffUser = await this.userService.findById(user.schemaName, +id);
    if (staffUser && staffUser.role !== UserRole.STAFF) {
      throw new Error('User is not a STAFF member.');
    }
    return staffUser;
  }

  @Put(':id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateStaffUser(@GetUser() user: any, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const existingUser = await this.userService.findById(user.schemaName, +id);
    if (existingUser && existingUser.role !== UserRole.STAFF) {
      throw new Error('User is not a STAFF member.');
    }
    // Prevent changing role via this endpoint
    if (updateUserDto.role && updateUserDto.role !== UserRole.STAFF) {
      throw new Error('Role cannot be changed via this endpoint.');
    }
    return this.userService.updateUser(user.schemaName, +id, { ...updateUserDto, role: UserRole.STAFF });
  }

  @Delete(':id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deleteStaffUser(@GetUser() user: any, @Param('id') id: string) {
    const existingUser = await this.userService.findById(+id);
    if (existingUser && existingUser.role !== UserRole.STAFF) {
      throw new Error('User is not a STAFF member.');
    }
    return this.userService.deleteUser(user.schemaName, +id);
  }
}
