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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UserService } from './user.service';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @Roles(
    UserRole.ADMIN,
    UserRole.COMPLEX_ADMIN,
    UserRole.RESIDENT,
    UserRole.STAFF,
    UserRole.RECEPTION,
    UserRole.SECURITY,
    UserRole.STAFF,
  )
  getProfile(@GetUser() user: any) {
    return user;
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async createUser(@GetUser() user: any, @Body() userData: any) {
    return this.userService.createUser(user.schemaName, userData);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async findAllUsers(@GetUser() user: any, @Query('role') role?: string) {
    return this.userService.findAllUsers(user.schemaName, role);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async updateUser(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() userData: any,
  ) {
    return this.userService.updateUser(user.schemaName, id, userData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPLEX_ADMIN)
  async deleteUser(@GetUser() user: any, @Param('id') id: string) {
    return this.userService.deleteUser(user.schemaName, id);
  }
}