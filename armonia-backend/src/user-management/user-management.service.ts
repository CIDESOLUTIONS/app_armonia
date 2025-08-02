import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../common/dto/user-management.dto';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserManagementService {
  constructor(private prisma: PrismaService) {}

  async getStaffUsers(schemaName: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.user.findMany({
      where: {
        role: { in: [UserRole.STAFF, UserRole.RECEPTION, UserRole.SECURITY] },
      },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async createStaffUser(
    schemaName: string,
    data: CreateUserDto,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con este email.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.STAFF, // Default to STAFF if not provided
      },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async updateStaffUser(schemaName: string, id: string, data: UpdateUserDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async deleteStaffUser(schemaName: string, id: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    await prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
  }
}