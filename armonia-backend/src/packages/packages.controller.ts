import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { PackagesService } from './packages.service';
import {
  RegisterPackageDto,
  UpdatePackageDto,
  PackageDto,
  PackageFilterParamsDto,
} from '../common/dto/packages.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@UseGuards(JwtAuthGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  async registerPackage(
    @GetUser() user: any,
    @Body() registerPackageDto: RegisterPackageDto,
  ): Promise<PackageDto> {
    return this.packagesService.registerPackage(
      user.schemaName,
      registerPackageDto,
    );
  }

  @Get()
  async getPackages(
    @GetUser() user: any,
    @Query() filters: PackageFilterParamsDto,
  ): Promise<{ data: PackageDto[]; total: number }> {
    // Residents should only see their own packages
    if (user.role === UserRole.RESIDENT) {
      filters.residentId = user.residentId; // Assuming residentId is on the user object
    }
    return this.packagesService.getPackages(user.schemaName, filters);
  }

  @Get(':id')
  async getPackageById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<PackageDto> {
    return this.packagesService.getPackageById(user.schemaName, id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  async updatePackageStatus(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<PackageDto> {
    return this.packagesService.updatePackageStatus(
      user.schemaName,
      id,
      updatePackageDto,
    );
  }
}
