import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCommonAreaDto,
  UpdateCommonAreaDto,
  CreateParkingSpotDto,
  UpdateParkingSpotDto,
  CreatePropertyDto,
  UpdatePropertyDto,
  CreatePetDto,
  CreateVehicleDto,
  CreateResidentDto,
  UpdateResidentDto,
} from '../common/dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Common Area Methods
  async createCommonArea(
    schemaName: string,
    createCommonAreaDto: CreateCommonAreaDto,
  ) {
    return this.prisma.getTenantDB(schemaName).amenity.create({
      data: {
        name: createCommonAreaDto.name,
        description: createCommonAreaDto.description,
        type: createCommonAreaDto.type,
        rules: createCommonAreaDto.rules,
        residentialComplexId: createCommonAreaDto.residentialComplexId,
      },
    });
  }

  async getCommonAreas(schemaName: string) {
    return this.prisma.getTenantDB(schemaName).amenity.findMany();
  }

  async getCommonAreaById(schemaName: string, id: string) {
    const commonArea = await this.prisma
      .getTenantDB(schemaName)
      .amenity.findUnique({
        where: { id },
      });
    if (!commonArea) {
      throw new NotFoundException(`Common Area with ID ${id} not found`);
    }
    return commonArea;
  }

  async updateCommonArea(
    schemaName: string,
    id: string,
    updateCommonAreaDto: UpdateCommonAreaDto,
  ) {
    const existingCommonArea = await this.prisma
      .getTenantDB(schemaName)
      .amenity.findUnique({
        where: { id },
      });

    if (!existingCommonArea) {
      throw new NotFoundException(`Common Area with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).amenity.update({
      where: { id },
      data: updateCommonAreaDto,
    });
  }

  async deleteCommonArea(schemaName: string, id: string) {
    const existingCommonArea = await this.prisma
      .getTenantDB(schemaName)
      .amenity.findUnique({
        where: { id },
      });

    if (!existingCommonArea) {
      throw new NotFoundException(`Common Area with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).amenity.delete({
      where: { id },
    });
  }

  // Parking Spot Methods
  async createParkingSpot(
    schemaName: string,
    createParkingSpotDto: CreateParkingSpotDto,
  ) {
    return this.prisma.getTenantDB(schemaName).parking.create({
      data: {
        number: createParkingSpotDto.number,
        type: createParkingSpotDto.type,
        residentialComplexId: createParkingSpotDto.residentialComplexId,
        propertyId: createParkingSpotDto.propertyId,
      },
    });
  }

  async getParkingSpots(schemaName: string, residentialComplexId: string) {
    return this.prisma.getTenantDB(schemaName).parking.findMany({
      where: { residentialComplexId },
    });
  }

  async getParkingSpotById(schemaName: string, id: string) {
    const parkingSpot = await this.prisma
      .getTenantDB(schemaName)
      .parking.findUnique({
        where: { id },
      });
    if (!parkingSpot) {
      throw new NotFoundException(`Parking Spot with ID ${id} not found`);
    }
    return parkingSpot;
  }

  async updateParkingSpot(
    schemaName: string,
    id: string,
    updateParkingSpotDto: UpdateParkingSpotDto,
  ) {
    const existingParkingSpot = await this.prisma
      .getTenantDB(schemaName)
      .parking.findUnique({
        where: { id },
      });

    if (!existingParkingSpot) {
      throw new NotFoundException(`Parking Spot with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).parking.update({
      where: { id },
      data: updateParkingSpotDto,
    });
  }

  async deleteParkingSpot(schemaName: string, id: string) {
    const existingParkingSpot = await this.prisma
      .getTenantDB(schemaName)
      .parking.findUnique({
        where: { id },
      });

    if (!existingParkingSpot) {
      throw new NotFoundException(`Parking Spot with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).parking.delete({
      where: { id },
    });
  }

  // Property Methods
  async getProperties(schemaName: string, residentialComplexId: string) {
    return this.prisma.getTenantDB(schemaName).property.findMany({
      where: { residentialComplexId },
      include: { residents: true, parkings: true, intercoms: true },
    });
  }

  async createProperty(
    schemaName: string,
    createPropertyDto: CreatePropertyDto,
  ) {
    return this.prisma.getTenantDB(schemaName).property.create({
      data: {
        type: createPropertyDto.type,
        number: createPropertyDto.unitNumber,
        ownerId: createPropertyDto.ownerId,
        residentialComplexId: createPropertyDto.residentialComplexId,
      },
    });
  }

  async updateProperty(
    schemaName: string,
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ) {
    const existingProperty = await this.prisma
      .getTenantDB(schemaName)
      .property.findUnique({
        where: { id },
      });

    if (!existingProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  // Pet Methods
  async getPets(schemaName: string, residentialComplexId: string) {
    return this.prisma.getTenantDB(schemaName).pet.findMany({
      where: { residentialComplexId },
      include: { owner: true },
    });
  }

  async createPet(schemaName: string, createPetDto: CreatePetDto) {
    return this.prisma.getTenantDB(schemaName).pet.create({
      data: {
        name: createPetDto.name,
        breed: createPetDto.breed,
        ownerId: createPetDto.ownerId,
        residentialComplexId: createPetDto.residentialComplexId,
      },
    });
  }

  // Vehicle Methods
  async getVehicles(schemaName: string, residentialComplexId: string) {
    return this.prisma.getTenantDB(schemaName).vehicle.findMany({
      where: { residentialComplexId },
      include: { owner: true },
    });
  }

  async createVehicle(schemaName: string, createVehicleDto: CreateVehicleDto) {
    return this.prisma.getTenantDB(schemaName).vehicle.create({
      data: {
        plate: createVehicleDto.licensePlate,
        brand: createVehicleDto.brand,
        model: createVehicleDto.model,
        ownerId: createVehicleDto.ownerId,
        residentialComplexId: createVehicleDto.residentialComplexId,
      },
    });
  }

  // Resident Methods
  async getResidents(schemaName: string, residentialComplexId: string) {
    return this.prisma.getTenantDB(schemaName).resident.findMany({
      where: { property: { residentialComplexId } },
      include: { property: true, user: true },
    });
  }

  async createResident(
    schemaName: string,
    createResidentDto: CreateResidentDto,
  ) {
    return this.prisma.getTenantDB(schemaName).resident.create({
      data: {
        name: createResidentDto.name,
        email: createResidentDto.email,
        phone: createResidentDto.phone,
        propertyId: createResidentDto.propertyId,
        userId: createResidentDto.userId,
      },
    });
  }

  async updateResident(
    schemaName: string,
    id: string,
    updateResidentDto: UpdateResidentDto,
  ) {
    const existingResident = await this.prisma
      .getTenantDB(schemaName)
      .resident.findUnique({
        where: { id },
      });

    if (!existingResident) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).resident.update({
      where: { id },
      data: updateResidentDto,
    });
  }

  async deleteResident(schemaName: string, id: string) {
    const existingResident = await this.prisma
      .getTenantDB(schemaName)
      .resident.findUnique({
        where: { id },
      });

    if (!existingResident) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }

    return this.prisma.getTenantDB(schemaName).resident.delete({
      where: { id },
    });
  }

  // Service Provider Methods (assuming 'services' refers to ServiceProviders)
  async getServices(schemaName: string, residentialComplexId: string) {
    return this.prisma.getTenantDB(schemaName).serviceProvider.findMany({
      where: { residentialComplexId },
    });
  }

  // Placeholder for getInventoryStats - needs more context on what stats are expected
  async getInventoryStats(schemaName: string, residentialComplexId: string) {
    // This method would typically aggregate data from various inventory models.
    // For now, returning a placeholder.
    return {
      commonAreasCount: await this.prisma
        .getTenantDB(schemaName)
        .amenity.count({ where: { residentialComplexId } }),
      parkingSpotsCount: await this.prisma
        .getTenantDB(schemaName)
        .parking.count({ where: { residentialComplexId } }),
      propertiesCount: await this.prisma
        .getTenantDB(schemaName)
        .property.count({ where: { residentialComplexId } }),
      petsCount: await this.prisma
        .getTenantDB(schemaName)
        .pet.count({ where: { residentialComplexId } }),
      vehiclesCount: await this.prisma
        .getTenantDB(schemaName)
        .vehicle.count({ where: { residentialComplexId } }),
      residentsCount: await this.prisma
        .getTenantDB(schemaName)
        .resident.count({ where: { property: { residentialComplexId } } }),
      serviceProvidersCount: await this.prisma
        .getTenantDB(schemaName)
        .serviceProvider.count({ where: { residentialComplexId } }),
    };
  }
}
