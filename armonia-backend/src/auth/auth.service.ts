import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import { ResidentialComplexService } from '../residential-complex/residential-complex.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tenantService: TenantService,
    @Inject(ResidentialComplexService) private residentialComplexService: ResidentialComplexService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
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

    const existingUser = await this.userService.findByEmail(adminData.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const newComplex = await this.residentialComplexService.createComplexAndSchema(complexData);

    const adminPayload = {
      ...adminData,
      role: UserRole.COMPLEX_ADMIN,
      complexId: newComplex.id,
    };

    const newAdmin = await this.userService.createUser(newComplex.schemaName, adminPayload);

    return this.login(newAdmin);
  }
}
