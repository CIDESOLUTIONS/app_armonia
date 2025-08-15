import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Reverted to relative path
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string, prismaClient?: any) {
    const prisma = prismaClient || this.prisma.getTenantDB('public');
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(schemaName: string, id: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(schemaName: string, data: any) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAllUsers(schemaName: string, role?: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};
    if (role) {
      where.role = role;
    }
    return prisma.user.findMany({ where });
  }

  async updateUser(schemaName: string, id: string, data: any) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(schemaName: string, id: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    await prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
  }
}
