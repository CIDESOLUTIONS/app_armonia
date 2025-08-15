import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => ResidentialComplexService)) // Applied forwardRef here
    private residentialComplexService: ResidentialComplexService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const prisma = this.prismaService.getTenantDB('public'); // Use a default schema for user lookup
    const user = await this.userService.findByEmail(email, prisma);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const schemaName = user.residentialComplexId
      ? await this.tenantService.getTenantSchemaName(user.residentialComplexId)
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

    // This is a complex transaction that involves multiple schemas and should be handled carefully.
    // For now, we'll assume a simplified approach where we create the complex and then the admin.

    const newComplex =
      await this.residentialComplexService.createComplexAndSchema(complexData);

    const adminPayload = {
      ...adminData,
      role: UserRole.COMPLEX_ADMIN,
      complexId: newComplex.id,
    };

    const newAdmin = await this.userService.createUser(
      newComplex.id.toString(), // schemaName is now the complexId, convert to string
      adminPayload,
    );

    return this.login(newAdmin);
  }

  async handleDemoRequest(data: any) {
    const { name, email, complexName, phone, message } = data;

    // Save the demo request to the database using the default client
    const prisma = this.prismaService.getTenantDB('public');
    await prisma.demoRequest.create({
      data: {
        name,
        email,
        complexName,
        phone,
        message,
      },
    });

    // Here you would typically send an email to the sales team
    // For this example, we'll just log it to the console
    console.log(
      `New demo request: ${name} <${email}> for ${complexName} (Phone: ${phone}, Message: ${message})`,
    );

    return { message: 'Demo request received successfully' };
  }
}
