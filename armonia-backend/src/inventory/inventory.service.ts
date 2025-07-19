import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class InventoryService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  // PROPIEDADES
  async getProperties(
    schemaName: string,
    complexId: number,
  ): Promise<PropertyWithDetailsDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const properties = await prisma.property.findMany({
        where: { complexId },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          residents: {
            select: { id: true },
            where: { status: 'ACTIVE' },
          },
        },
        orderBy: { unitNumber: 'asc' },
      });

      return properties.map((property) => ({
        id: property.id,
        complexId: property.complexId,
        unitNumber: property.unitNumber,
        type: property.type,
        status: property.status,
        area: property.area || undefined,
        block: property.block || undefined,
        zone: property.zone || undefined,
        ownerId: property.ownerId || undefined,
        ownerName: property.owner?.name || undefined,
        ownerEmail: property.owner?.email || undefined,
        totalResidents: property.residents.length,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      }));
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo propiedades:', error);
      throw new Error('Error obteniendo propiedades');
    }
  }

  async createProperty(schemaName: string, data: CreatePropertyDto) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const property = await prisma.property.create({
        data: {
          complexId: data.complexId,
          unitNumber: data.unitNumber,
          type: data.type,
          status: data.status,
          area: data.area,
          block: data.block,
          zone: data.zone,
          ownerId: data.ownerId,
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return property;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error creando propiedad:', error);
      throw new Error('Error creando propiedad');
    }
  }

  async updateProperty(
    schemaName: string,
    id: number,
    data: UpdatePropertyDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const property = await prisma.property.update({
        where: { id },
        data,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return property;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error actualizando propiedad:', error);
      throw new Error('Error actualizando propiedad');
    }
  }

  // MASCOTAS
  async getPets(
    schemaName: string,
    complexId: number,
    propertyId?: number,
  ): Promise<PetWithDetailsDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const whereClause: any = {
        property: { complexId },
      };
      if (propertyId) {
        whereClause.propertyId = propertyId;
      }
      const pets = await prisma.pet.findMany({
        where: whereClause,
        include: {
          property: {
            select: { id: true, unitNumber: true },
          },
          resident: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      return pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed || undefined,
        age: pet.age || undefined,
        weight: pet.weight || undefined,
        color: pet.color || undefined,
        vaccinated: pet.vaccinated,
        vaccineExpiryDate: pet.vaccineExpiryDate || undefined,
        notes: pet.notes || undefined,
        propertyId: pet.propertyId,
        residentId: pet.residentId,
        unitNumber: pet.property.unitNumber,
        residentName: pet.resident.name,
        createdAt: pet.createdAt,
      }));
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo mascotas:', error);
      throw new Error('Error obteniendo mascotas');
    }
  }

  async createPet(schemaName: string, data: CreatePetDto) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const pet = await prisma.pet.create({
        data: {
          name: data.name,
          type: data.type,
          breed: data.breed,
          age: data.age,
          weight: data.weight,
          color: data.color,
          propertyId: data.propertyId,
          residentId: data.residentId,
          vaccinated: data.vaccinated,
          vaccineExpiryDate: data.vaccineExpiryDate
            ? new Date(data.vaccineExpiryDate)
            : null,
          notes: data.notes,
        },
        include: {
          property: {
            select: { unitNumber: true },
          },
          resident: {
            select: { name: true },
          },
        },
      });

      return pet;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error creando mascota:', error);
      throw new Error('Error creando mascota');
    }
  }

  // VEHÍCULOS
  async getVehicles(
    schemaName: string,
    complexId: number,
    propertyId?: number,
  ): Promise<VehicleWithDetailsDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const whereClause: any = {
        property: { complexId },
      };
      if (propertyId) {
        whereClause.propertyId = propertyId;
      }
      const vehicles = await prisma.vehicle.findMany({
        where: whereClause,
        include: {
          property: {
            select: { id: true, unitNumber: true },
          },
          resident: {
            select: { id: true, name: true },
          },
        },
        orderBy: { licensePlate: 'asc' },
      });
      return vehicles.map((vehicle) => ({
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        type: vehicle.type,
        parkingSpot: vehicle.parkingSpot || undefined,
        notes: vehicle.notes || undefined,
        propertyId: vehicle.propertyId,
        residentId: vehicle.residentId,
        unitNumber: vehicle.property.unitNumber,
        residentName: vehicle.resident.name,
        createdAt: vehicle.createdAt,
      }));
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo vehículos:', error);
      throw new Error('Error obteniendo vehículos');
    }
  }

  async createVehicle(schemaName: string, data: CreateVehicleDto) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const vehicle = await prisma.vehicle.create({
        data: {
          licensePlate: data.licensePlate.toUpperCase(),
          brand: data.brand,
          model: data.model,
          year: data.year,
          color: data.color,
          type: data.type,
          parkingSpot: data.parkingSpot,
          notes: data.notes,
          propertyId: data.propertyId,
          residentId: data.residentId,
        },
        include: {
          property: {
            select: { unitNumber: true },
          },
          resident: {
            select: { name: true },
          },
        },
      });

      return vehicle;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error creando vehículo:', error);
      throw new Error('Error creando vehículo');
    }
  }

  // RESIDENTES
  async getResidents(
    schemaName: string,
    complexId: number,
    propertyId?: number,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const whereClause: any = {
        property: { complexId },
      };
      if (propertyId) {
        whereClause.propertyId = propertyId;
      }
      const residents = await prisma.resident.findMany({
        where: whereClause,
        include: {
          property: {
            select: { id: true, unitNumber: true, type: true },
          },
          pets: {
            select: { id: true, name: true, type: true },
          },
          vehicles: {
            select: { id: true, licensePlate: true, brand: true, model: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      return residents;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo residentes:', error);
      throw new Error('Error obteniendo residentes');
    }
  }

  async updateResident(
    schemaName: string,
    id: number,
    data: UpdateResidentDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const resident = await prisma.resident.update({
        where: { id },
        data,
        include: {
          property: {
            select: { unitNumber: true },
          },
        },
      });

      return resident;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error actualizando residente:', error);
      throw new Error('Error actualizando residente');
    }
  }

  async createResident(schemaName: string, data: CreateResidentDto) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const resident = await prisma.resident.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return resident;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error creando residente:', error);
      throw new Error('Error creando residente');
    }
  }

  async deleteResident(schemaName: string, id: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.resident.delete({ where: { id } });
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error eliminando residente:', error);
      throw new Error('Error eliminando residente');
    }
  }

  // SERVICIOS COMUNES
  async getServices(schemaName: string, complexId: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const services = await prisma.commonService.findMany({
        where: { complexId },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      return services;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo servicios:', error);
      throw new Error('Error obteniendo servicios');
    }
  }

  // ESTADÍSTICAS GENERALES
  async getInventoryStats(schemaName: string, complexId: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const [
        totalProperties,
        occupiedProperties,
        totalResidents,
        totalPets,
        totalVehicles,
        totalServices,
      ] = await Promise.all([
        prisma.property.count({ where: { complexId } }),
        prisma.property.count({ where: { complexId, status: 'OCCUPIED' } }),
        prisma.resident.count({
          where: {
            property: { complexId },
            status: 'ACTIVE',
          },
        }),
        prisma.pet.count({ where: { property: { complexId } } }),
        prisma.vehicle.count({ where: { property: { complexId } } }),
        prisma.commonService.count({ where: { complexId } }),
      ]);

      const occupancyRate =
        totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;

      return {
        properties: {
          total: totalProperties,
          occupied: occupiedProperties,
          available: totalProperties - occupiedProperties,
          occupancyRate: Math.round(occupancyRate * 100) / 100,
        },
        residents: {
          total: totalResidents,
          averagePerProperty:
            totalProperties > 0
              ? Math.round((totalResidents / totalProperties) * 100) / 100
              : 0,
        },
        pets: {
          total: totalPets,
          averagePerProperty:
            totalProperties > 0
              ? Math.round((totalPets / totalProperties) * 100) / 100
              : 0,
        },
        vehicles: {
          total: totalVehicles,
          averagePerProperty:
            totalProperties > 0
              ? Math.round((totalVehicles / totalProperties) * 100) / 100
              : 0,
        },
        services: {
          total: totalServices,
        },
      };
    } catch (error) {
      console.error(
        '[INVENTORY SERVICE] Error obteniendo estadísticas:',
        error,
      );
      throw new Error('Error obteniendo estadísticas de inventario');
    }
  }

  // Common Area Management
  async createCommonArea(
    schemaName: string,
    data: CreateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.commonArea.create({ data });
  }

  async getCommonAreas(schemaName: string): Promise<CommonAreaDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.commonArea.findMany();
  }

  async getCommonAreaById(
    schemaName: string,
    id: number,
  ): Promise<CommonAreaDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    return commonArea;
  }

  async updateCommonArea(
    schemaName: string,
    id: number,
    data: UpdateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    return prisma.commonArea.update({ where: { id }, data });
  }

  async deleteCommonArea(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    await prisma.commonArea.delete({ where: { id } });
  }

  // Parking Spot Management
  async createParkingSpot(
    schemaName: string,
    data: CreateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.parkingSpot.create({ data });
  }

  async getParkingSpots(
    schemaName: string,
    complexId: number,
  ): Promise<ParkingSpotDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.parkingSpot.findMany({ where: { complexId } });
  }

  async getParkingSpotById(
    schemaName: string,
    id: number,
  ): Promise<ParkingSpotDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const parkingSpot = await prisma.parkingSpot.findUnique({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(
        `Espacio de estacionamiento con ID ${id} no encontrado.`,
      );
    }
    return parkingSpot;
  }

  async updateParkingSpot(
    schemaName: string,
    id: number,
    data: UpdateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const parkingSpot = await prisma.parkingSpot.findUnique({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(
        `Espacio de estacionamiento con ID ${id} no encontrado.`,
      );
    }
    return prisma.parkingSpot.update({ where: { id }, data });
  }

  async deleteParkingSpot(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const parkingSpot = await prisma.parkingSpot.findUnique({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(
        `Espacio de estacionamiento con ID ${id} no encontrado.`,
      );
    }
    await prisma.parkingSpot.delete({ where: { id } });
  }
}
