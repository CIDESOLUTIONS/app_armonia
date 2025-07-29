import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string, prismaClient?: any) {
    const prisma = prismaClient || this.prisma;
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const prisma = this.prisma;
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(schemaName: string, data: any, prismaClient?: any) {
    const prisma = prismaClient || this.prisma;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAllUsers(schemaName: string, role?: string) {
    const prisma = this.prisma;
    const where: any = {};
    if (role) {
      where.role = role;
    }
    return prisma.user.findMany({ where });
  }

  async updateUser(schemaName: string, id: number, data: any) {
    const prisma = this.prisma;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(schemaName: string, id: number) {
    const prisma = this.prisma;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    await prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
  }
}
