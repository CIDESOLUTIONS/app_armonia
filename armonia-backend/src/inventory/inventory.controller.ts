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
  CreateResidentDto,
  CreateCommonAreaDto,
  UpdateCommonAreaDto,
  CommonAreaDto,
  CreateParkingSpotDto,
  UpdateParkingSpotDto,
  ParkingSpotDto,
} from '../common/dto/inventory.dto';

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
    const createdCommonArea = await this.inventoryService.createCommonArea(
      user.schemaName,
      {
        ...createCommonAreaDto,
        residentialComplexId: user.residentialComplexId,
      },
    );
    return createdCommonArea;
  }

  @Get('common-areas')
  async getCommonAreas(@GetUser() user: any): Promise<CommonAreaDto[]> {
    const commonAreas = await this.inventoryService.getCommonAreas(
      user.schemaName,
    );
    return commonAreas;
  }

  @Get('common-areas/:id')
  async getCommonAreaById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<CommonAreaDto> {
    const commonArea = await this.inventoryService.getCommonAreaById(
      user.schemaName,
      id,
    );
    return commonArea;
  }

  @Put('common-areas/:id')
  async updateCommonArea(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateCommonAreaDto: UpdateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    const updatedCommonArea = await this.inventoryService.updateCommonArea(
      user.schemaName,
      id,
      updateCommonAreaDto,
    );
    return updatedCommonArea;
  }

  @Delete('common-areas/:id')
  async deleteCommonArea(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.inventoryService.deleteCommonArea(user.schemaName, id);
  }

  // Parking Spot Endpoints
  @Post('parking-spots')
  async createParkingSpot(
    @GetUser() user: any,
    @Body() createParkingSpotDto: CreateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    const createdParkingSpot = await this.inventoryService.createParkingSpot(
      user.schemaName,
      {
        ...createParkingSpotDto,
        residentialComplexId: user.residentialComplexId,
      },
    );
    return createdParkingSpot;
  }

  @Get('parking-spots')
  async getParkingSpots(@GetUser() user: any): Promise<ParkingSpotDto[]> {
    const parkingSpots = await this.inventoryService.getParkingSpots(
      user.schemaName,
      user.residentialComplexId,
    );
    return parkingSpots;
  }

  @Get('parking-spots/:id')
  async getParkingSpotById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<ParkingSpotDto> {
    const parkingSpot = await this.inventoryService.getParkingSpotById(
      user.schemaName,
      id,
    );
    return parkingSpot;
  }

  @Put('parking-spots/:id')
  async updateParkingSpot(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    const updatedParkingSpot = await this.inventoryService.updateParkingSpot(
      user.schemaName,
      id,
      updateParkingSpotDto,
    );
    return updatedParkingSpot;
  }

  @Delete('parking-spots/:id')
  async deleteParkingSpot(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.inventoryService.deleteParkingSpot(user.schemaName, id);
  }

  // PROPIEDADES
  @Get('properties')
  async getProperties(@GetUser() user: any): Promise<PropertyWithDetailsDto[]> {
    const properties = await this.inventoryService.getProperties(
      user.schemaName,
      user.residentialComplexId,
    );
    return properties.map((p) => ({ ...p, unitNumber: p.number }));
  }

  @Post('properties')
  async createProperty(
    @GetUser() user: any,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    const createdProperty = await this.inventoryService.createProperty(
      user.schemaName,
      {
        ...createPropertyDto,
        residentialComplexId: user.residentialComplexId,
      },
    );
    return { ...createdProperty, unitNumber: createdProperty.number };
  }

  @Put('properties/:id')
  async updateProperty(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const updatedProperty = await this.inventoryService.updateProperty(
      user.schemaName,
      id,
      updatePropertyDto,
    );
    return { ...updatedProperty, unitNumber: updatedProperty.number };
  }

  @Get('pets')
  async getPets(@GetUser() user: any): Promise<PetWithDetailsDto[]> {
    const pets = await this.inventoryService.getPets(
      user.schemaName,
      user.residentialComplexId,
    );
    return pets.map((p) => ({ ...p, ownerName: p.owner.name }));
  }

  @Post('pets')
  async createPet(@GetUser() user: any, @Body() createPetDto: CreatePetDto) {
    const createdPet = await this.inventoryService.createPet(user.schemaName, {
      ...createPetDto,
      residentialComplexId: user.residentialComplexId,
    });
    return createdPet;
  }

  @Get('vehicles')
  async getVehicles(@GetUser() user: any): Promise<VehicleWithDetailsDto[]> {
    const vehicles = await this.inventoryService.getVehicles(
      user.schemaName,
      user.residentialComplexId,
    );
    return vehicles.map((v) => ({
      ...v,
      licensePlate: v.plate,
      ownerName: v.owner.name,
    }));
  }

  @Post('vehicles')
  async createVehicle(
    @GetUser() user: any,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    const createdVehicle = await this.inventoryService.createVehicle(
      user.schemaName,
      createVehicleDto,
    );
    return { ...createdVehicle, licensePlate: createdVehicle.plate };
  }

  @Get('residents')
  async getResidents(@GetUser() user: any) {
    return this.inventoryService.getResidents(
      user.schemaName,
      user.residentialComplexId,
    );
  }

  @Put('residents/:id')
  async updateResident(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateResidentDto: UpdateResidentDto,
  ) {
    return this.inventoryService.updateResident(
      user.schemaName,
      id,
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
    return this.inventoryService.deleteResident(user.schemaName, id);
  }

  @Get('services')
  async getServices(@GetUser() user: any) {
    return this.inventoryService.getServices(
      user.schemaName,
      user.residentialComplexId,
    );
  }

  @Get('stats')
  async getInventoryStats(@GetUser() user: any) {
    return this.inventoryService.getInventoryStats(
      user.schemaName,
      user.residentialComplexId,
    );
  }
}
