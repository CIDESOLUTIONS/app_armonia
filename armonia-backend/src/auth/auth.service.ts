import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import { ResidentialComplexService } from '../residential-complex/residential-complex.service';
import { UserRole } from '../common/enums/user-role.enum';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tenantService: TenantService,
    private prismaService: PrismaService,
    @Inject(ResidentialComplexService) private residentialComplexService: ResidentialComplexService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const prisma = this.prismaService; // Usar el cliente por defecto
    const user = await this.userService.findByEmail(email, prisma);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const schemaName = user.complexId
      ? await this.tenantService.getTenantSchemaName(user.complexId)
      : null;
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      complexId: user.complexId,
      schemaName: schemaName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerComplex(data: any) {
    const { complexData, adminData } = data;

    // Usar el cliente por defecto para la transacción
    const defaultPrisma = this.prismaService;

    return defaultPrisma.$transaction(async (txPrisma) => {
      const existingUser = await this.userService.findByEmail(adminData.email, txPrisma);
      if (existingUser) {
        throw new UnauthorizedException('User with this email already exists');
      }

      const newComplex = await this.residentialComplexService.createComplexAndSchema(complexData, txPrisma);

      const adminPayload = {
        ...adminData,
        role: UserRole.COMPLEX_ADMIN,
        complexId: newComplex.id,
      };

      const newAdmin = await this.userService.createUser(newComplex.schemaName, adminPayload, txPrisma);

      return this.login(newAdmin);
    });
  }

  async handleDemoRequest(data: any) {
    const { name, email, complexName, units } = data;

    // Save the demo request to the database using the default client
    const defaultPrisma = this.prismaService;
    await defaultPrisma.demoRequest.create({
      data: {
        name,
        email,
        complexName,
        units,
      },
    });

    // Here you would typically send an email to the sales team
    // For this example, we'll just log it to the console
    console.log(`New demo request: ${name} <${email}> for ${complexName} with ${units} units`);

    return { message: 'Demo request received successfully' };
  }
}