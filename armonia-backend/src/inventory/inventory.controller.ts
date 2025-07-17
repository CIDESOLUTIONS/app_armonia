import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  PropertyWithDetailsDto,
  PetWithDetailsDto,
  VehicleWithDetailsDto,
  CreatePropertyDto,
  UpdatePropertyDto,
  CreatePetDto,
  CreateVehicleDto,
  UpdateResidentDto,
} from '../common/dto/inventory.dto';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('properties')
  async getProperties(@GetUser() user: any): Promise<PropertyWithDetailsDto[]> {
    return this.inventoryService.getProperties(user.schemaName, user.complexId);
  }

  @Post('properties')
  async createProperty(
    @GetUser() user: any,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.inventoryService.createProperty(user.schemaName, {
      ...createPropertyDto,
      complexId: user.complexId,
    });
  }

  @Put('properties/:id')
  async updateProperty(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.inventoryService.updateProperty(
      user.schemaName,
      +id,
      updatePropertyDto,
    );
  }

  @Get('pets')
  async getPets(@GetUser() user: any): Promise<PetWithDetailsDto[]> {
    return this.inventoryService.getPets(user.schemaName, user.complexId);
  }

  @Post('pets')
  async createPet(@GetUser() user: any, @Body() createPetDto: CreatePetDto) {
    return this.inventoryService.createPet(user.schemaName, {
      ...createPetDto,
      complexId: user.complexId,
    });
  }

  @Get('vehicles')
  async getVehicles(@GetUser() user: any): Promise<VehicleWithDetailsDto[]> {
    return this.inventoryService.getVehicles(user.schemaName, user.complexId);
  }

  @Post('vehicles')
  async createVehicle(
    @GetUser() user: any,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    return this.inventoryService.createVehicle(user.schemaName, {
      ...createVehicleDto,
      complexId: user.complexId,
    });
  }

  @Get('residents')
  async getResidents(@GetUser() user: any) {
    return this.inventoryService.getResidents(user.schemaName, user.complexId);
  }

  @Put('residents/:id')
  async updateResident(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateResidentDto: UpdateResidentDto,
  ) {
    return this.inventoryService.updateResident(
      user.schemaName,
      +id,
      updateResidentDto,
    );
  }

  @Post('residents')
  async createResident(
    @GetUser() user: any,
    @Body() createResidentDto: CreateResidentDto,
  ) {
    return this.inventoryService.createResident(
      user.schemaName,
      createResidentDto,
    );
  }

  @Delete('residents/:id')
  async deleteResident(
    @GetUser() user: any,
    @Param('id') id: string,
  ) {
    return this.inventoryService.deleteResident(user.schemaName, +id);
  }

  @Get('services')
  async getServices(@GetUser() user: any) {
    return this.inventoryService.getServices(user.schemaName, user.complexId);
  }

  @Get('stats')
  async getInventoryStats(@GetUser() user: any) {
    return this.inventoryService.getInventoryStats(
      user.schemaName,
      user.complexId,
    );
  }
}
