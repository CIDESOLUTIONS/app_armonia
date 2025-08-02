import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(private prisma: PrismaService) {}

  // PROPIEDADES
  async getProperties(
    schemaName: string,
    propertyId?: string, // Added propertyId as an optional parameter
  ): Promise<PropertyWithDetailsDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const whereClause: any = {};
      if (propertyId) {
        whereClause.id = propertyId;
      }
      const properties = await prisma.property.findMany({
        where: whereClause,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          residents: {
            select: { id: true },
          },
        },
        orderBy: { number: 'asc' },
      });

      return properties.map((property) => ({
        id: property.id,
        unitNumber: property.number,
        type: property.type,
        ownerId: property.ownerId || undefined,
        ownerName: property.owner?.name || undefined,
        ownerEmail: property.owner?.email || undefined,
        totalResidents: property.residents.length,
        residentialComplexId: property.residentialComplexId, // Corrected property name
        status: 'Active', // Placeholder, assuming active status
        createdAt: property.createdAt, // Added missing property
        updatedAt: property.updatedAt, // Added missing property
      }));
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo propiedades:', error);
      throw new Error('Error obteniendo propiedades');
    }
  }

  async createProperty(schemaName: string, data: CreatePropertyDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const property = await prisma.property.create({
        data: {
          unitNumber: data.unitNumber,
          type: data.type,
          status: data.status,
          owner: { connect: { id: data.ownerId } },
          residentialComplex: { connect: { id: data.residentialComplexId } }, // Corrected property name
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
    id: string,
    data: UpdatePropertyDto,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const property = await prisma.property.update({
        where: { id },
        data: {
          unitNumber: data.unitNumber,
          type: data.type,
          status: data.status,
          ...(data.ownerId && { owner: { connect: { id: data.ownerId } } }),
          ...(data.residentialComplexId && { residentialComplex: { connect: { id: data.residentialComplexId } } }), // Corrected property name
        },
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
    propertyId?: string, // Added propertyId as an optional parameter
  ): Promise<PetWithDetailsDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const whereClause: any = {};
      if (propertyId) {
        whereClause.propertyId = propertyId;
      }
      const pets = await prisma.pet.findMany({
        where: whereClause,
        include: {
          owner: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      return pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        breed: pet.breed || undefined,
        ownerId: pet.ownerId,
        ownerName: pet.owner.name,
        type: pet.type, // Corrected property name
        residentialComplexId: pet.residentialComplexId, // Corrected property name
        createdAt: pet.createdAt, // Added missing property
        updatedAt: pet.updatedAt, // Added missing property
      }));
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo mascotas:', error);
      throw new Error('Error obteniendo mascotas');
    }
  }

  async createPet(schemaName: string, data: CreatePetDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const pet = await prisma.pet.create({
        data: {
          name: data.name,
          breed: data.breed,
          type: data.type, // Corrected property name
          owner: { connect: { id: data.ownerId } },
          residentialComplex: { connect: { id: data.residentialComplexId } }, // Corrected property name
        },
        include: {
          owner: {
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
    propertyId?: string, // Added propertyId as an optional parameter
  ): Promise<VehicleWithDetailsDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const whereClause: any = {};
      if (propertyId) {
        whereClause.propertyId = propertyId;
      }
      const vehicles = await prisma.vehicle.findMany({
        where: whereClause,
        include: {
          owner: {
            select: { id: true, name: true },
          },
        },
        orderBy: { plate: 'asc' },
      });
      return vehicles.map((vehicle) => ({
        id: vehicle.id,
        licensePlate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        ownerId: vehicle.ownerId,
        ownerName: vehicle.owner.name,
        residentialComplexId: vehicle.residentialComplexId, // Corrected property name
        createdAt: vehicle.createdAt, // Added missing property
        updatedAt: vehicle.updatedAt, // Added missing property
      }));
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error obteniendo vehículos:', error);
      throw new Error('Error obteniendo vehículos');
    }
  }

  async createVehicle(schemaName: string, data: CreateVehicleDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const vehicle = await prisma.vehicle.create({
        data: {
          plate: data.licensePlate.toUpperCase(),
          brand: data.brand,
          model: data.model,
          owner: { connect: { id: data.ownerId } },
          residentialComplex: { connect: { id: data.residentialComplexId } }, // Corrected property name
        },
        include: {
          owner: {
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
    propertyId?: string, // Added propertyId as an optional parameter
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const whereClause: any = {};
      if (propertyId) {
        whereClause.propertyId = propertyId;
      }
      const residents = await prisma.resident.findMany({
        where: whereClause,
        include: {
          property: {
            select: { id: true, number: true, type: true },
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
    id: string,
    data: UpdateResidentDto,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const resident = await prisma.resident.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          isActive: data.isActive,
          idNumber: data.idNumber,
          idType: data.idType,
          isOwner: data.isOwner,
          relationshipWithOwner: data.relationshipWithOwner,
          biometricId: data.biometricId,
          ...(data.propertyId && { property: { connect: { id: data.propertyId } } }),
          ...(data.residentialComplexId && { residentialComplex: { connect: { id: data.residentialComplexId } } }),
        },
        include: {
          property: {
            select: { number: true },
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
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      const resident = await prisma.resident.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          isActive: data.isActive,
          idNumber: data.idNumber,
          idType: data.idType,
          isOwner: data.isOwner,
          relationshipWithOwner: data.relationshipWithOwner,
          biometricId: data.biometricId,
          property: { connect: { id: data.propertyId } },
          residentialComplex: { connect: { id: data.residentialComplexId } },
        },
      });
      return resident;
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error creando residente:', error);
      throw new Error('Error creando residente');
    }
  }

  async deleteResident(schemaName: string, id: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    try {
      await prisma.resident.delete({ where: { id } });
    } catch (error) {
      console.error('[INVENTORY SERVICE] Error eliminando residente:', error);
      throw new Error('Error eliminando residente');
    }
  }

  // Common Area Management
  async createCommonArea(
    schemaName: string,
    data: CreateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const commonArea = await prisma.amenity.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        rules: data.rules,
        residentialComplex: { connect: { id: data.residentialComplexId } },
      },
    });
    return { ...commonArea, type: commonArea.type, rules: commonArea.rules, residentialComplexId: commonArea.residentialComplexId, createdAt: commonArea.createdAt, updatedAt: commonArea.updatedAt };
  }

  async getCommonAreas(schemaName: string): Promise<CommonAreaDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const commonAreas = await prisma.amenity.findMany();
    return commonAreas.map(ca => ({ ...ca, type: ca.type, rules: ca.rules, residentialComplexId: ca.residentialComplexId, createdAt: ca.createdAt, updatedAt: ca.updatedAt }));
  }

  async getCommonAreaById(
    schemaName: string,
    id: string,
  ): Promise<CommonAreaDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const commonArea = await prisma.amenity.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    return { ...commonArea, type: commonArea.type, rules: commonArea.rules, residentialComplexId: commonArea.residentialComplexId, createdAt: commonArea.createdAt, updatedAt: commonArea.updatedAt };
  }

  async updateCommonArea(
    schemaName: string,
    id: string,
    data: UpdateCommonAreaDto,
  ): Promise<CommonAreaDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const commonArea = await prisma.amenity.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    const updatedCommonArea = await prisma.amenity.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        rules: data.rules,
        ...(data.residentialComplexId && { residentialComplex: { connect: { id: data.residentialComplexId } } }),
      },
    });
    return { ...updatedCommonArea, type: updatedCommonArea.type, rules: updatedCommonArea.rules, residentialComplexId: updatedCommonArea.residentialComplexId, createdAt: updatedCommonArea.createdAt, updatedAt: updatedCommonArea.updatedAt };
  }

  async deleteCommonArea(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const commonArea = await prisma.amenity.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    await prisma.amenity.delete({ where: { id } });
  }

  // Parking Spot Management
  async createParkingSpot(
    schemaName: string,
    data: CreateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const parkingSpot = await prisma.parking.create({
      data: {
        number: data.number,
        type: data.type,
        status: data.status,
        notes: data.notes,
        ...(data.propertyId && { property: { connect: { id: data.propertyId } } }),
        residentialComplex: { connect: { id: data.residentialComplexId } },
      },
    });
    return { ...parkingSpot, type: parkingSpot.type, status: parkingSpot.status, residentialComplexId: parkingSpot.residentialComplexId, createdAt: parkingSpot.createdAt, updatedAt: parkingSpot.updatedAt };
  }

  async getParkingSpots(
    schemaName: string,
  ): Promise<ParkingSpotDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const parkingSpots = await prisma.parking.findMany();
    return parkingSpots.map(ps => ({ ...ps, type: ps.type, status: ps.status, residentialComplexId: ps.residentialComplexId, createdAt: ps.createdAt, updatedAt: ps.updatedAt }));
  }

  async getParkingSpotById(
    schemaName: string,
    id: string,
  ): Promise<ParkingSpotDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const parkingSpot = await prisma.parking.findUnique({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(
        `Espacio de estacionamiento con ID ${id} no encontrado.`,
      );
    }
    return { ...parkingSpot, type: parkingSpot.type, status: parkingSpot.status, residentialComplexId: parkingSpot.residentialComplexId, createdAt: parkingSpot.createdAt, updatedAt: parkingSpot.updatedAt };
  }

  async updateParkingSpot(
    schemaName: string,
    id: string,
    data: UpdateParkingSpotDto,
  ): Promise<ParkingSpotDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const parkingSpot = await prisma.parking.findUnique({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(
        `Espacio de estacionamiento con ID ${id} no encontrado.`,
      );
    }
    const updatedParkingSpot = await prisma.parking.update({
      where: { id },
      data: {
        number: data.number,
        type: data.type,
        status: data.status,
        notes: data.notes,
        ...(data.propertyId && { property: { connect: { id: data.propertyId } } }),
        ...(data.residentialComplexId && { residentialComplex: { connect: { id: data.residentialComplexId } } }),
      },
    });
    return { ...updatedParkingSpot, type: updatedParkingSpot.type, status: updatedParkingSpot.status, residentialComplexId: updatedParkingSpot.residentialComplexId, createdAt: updatedParkingSpot.createdAt, updatedAt: updatedParkingSpot.updatedAt };
  }

  async deleteParkingSpot(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const parkingSpot = await prisma.parking.findUnique({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(
        `Espacio de estacionamiento con ID ${id} no encontrado.`,
      );
    }
    await prisma.parking.delete({ where: { id } });
  }

  async getServices(schemaName: string, complexId: string): Promise<any[]> {
    // Placeholder implementation for getServices
    // In a real scenario, this would fetch actual services related to the complex
    return [];
  }

  async getInventoryStats(schemaName: string, complexId: string): Promise<any> {
    // Placeholder implementation for getInventoryStats
    // In a real scenario, this would fetch aggregated inventory statistics
    const prisma = this.prisma.getTenantDB(schemaName);
    const totalProperties = await prisma.property.count({ where: { residentialComplexId: complexId } });
    const totalResidents = await prisma.resident.count({ where: { residentialComplexId: complexId } });
    const totalPets = await prisma.pet.count({ where: { residentialComplexId: complexId } });
    const totalVehicles = await prisma.vehicle.count({ where: { residentialComplexId: complexId } });
    const totalCommonAreas = await prisma.amenity.count({ where: { residentialComplexId: complexId } });
    const totalParkingSpots = await prisma.parking.count({ where: { residentialComplexId: complexId } });

    return {
      totalProperties,
      totalResidents,
      totalPets,
      totalVehicles,
      totalCommonAreas,
      totalParkingSpots,
    };
  }
}