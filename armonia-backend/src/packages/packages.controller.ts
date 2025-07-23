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

@UseGuards(JwtAuthGuard)
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
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
  ): Promise<PackageDto[]> {
    return this.packagesService.getPackages(user.schemaName, filters);
  }

  @Get(':id')
  async getPackageById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<PackageDto> {
    return this.packagesService.getPackageById(user.schemaName, +id);
  }

  @Put(':id/deliver')
  async deliverPackage(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<PackageDto> {
    return this.packagesService.deliverPackage(user.schemaName, +id);
  }

  @Put(':id')
  async updatePackage(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<PackageDto> {
    return this.packagesService.updatePackage(
      user.schemaName,
      +id,
      updatePackageDto,
    );
  }
}
