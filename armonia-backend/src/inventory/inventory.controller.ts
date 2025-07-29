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
import { InventoryService } from './inventory.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  PropertyWithDetailsDto,
  PetWithDetailsDto,
  VehicleWithDetailsDto,
  CreatePropertyDto,
  UpdatePropertyDto,
  CreatePetDto,
  CreateVehicleDto,
  UpdateResidentDto,
  CreateResidentDto,
  CreateCommonAreaDto,
  UpdateCommonAreaDto,
  CommonAreaDto,
  CreateParkingSpotDto,
  UpdateParkingSpotDto,
  ParkingSpotDto,
} from '../common/dto/inventory.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Common Area Endpoints
  @Post('common-areas')
  async createCommonArea(
    @GetUser() user: any,
    @Body() createCommonAreaDto: CreateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    return this.inventoryService.createCommonArea(user.schemaName, {
      ...createCommonAreaDto,
      complexId: user.complexId,
    });
  }

  @Get('common-areas')
  async getCommonAreas(@GetUser() user: any): Promise<CommonAreaDto[]> {
    return this.inventoryService.getCommonAreas(user.schemaName);
  }

  @Get('common-areas/:id')
  async getCommonAreaById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<CommonAreaDto> {
    return this.inventoryService.getCommonAreaById(user.schemaName, +id);
  }

  @Put('common-areas/:id')
  async updateCommonArea(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateCommonAreaDto: UpdateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    return this.inventoryService.updateCommonArea(
      user.schemaName,
      +id,
      updateCommonAreaDto,
    );
  }

  @Delete('common-areas/:id')
  async deleteCommonArea(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.inventoryService.deleteCommonArea(user.schemaName, +id);
  }

  // Parking Spot Endpoints
  @Post('parking-spots')
  async createParkingSpot(
    @GetUser() user: any,
    @Body() createParkingSpotDto: CreateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    return this.inventoryService.createParkingSpot(user.schemaName, {
      ...createParkingSpotDto,
      complexId: user.complexId,
    });
  }

  @Get('parking-spots')
  async getParkingSpots(@GetUser() user: any): Promise<ParkingSpotDto[]> {
    return this.inventoryService.getParkingSpots(
      user.schemaName,
      user.complexId,
    );
  }

  @Get('parking-spots/:id')
  async getParkingSpotById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<ParkingSpotDto> {
    return this.inventoryService.getParkingSpotById(user.schemaName, +id);
  }

  @Put('parking-spots/:id')
  async updateParkingSpot(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    return this.inventoryService.updateParkingSpot(
      user.schemaName,
      +id,
      updateParkingSpotDto,
    );
  }

  @Delete('parking-spots/:id')
  async deleteParkingSpot(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.inventoryService.deleteParkingSpot(user.schemaName, +id);
  }

  // PROPIEDADES
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
    return this.inventoryService.createVehicle(
      user.schemaName,
      createVehicleDto,
    );
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
  async deleteResident(@GetUser() user: any, @Param('id') id: string) {
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
