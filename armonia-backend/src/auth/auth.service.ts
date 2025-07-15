import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tenantService: TenantService,
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
    const schemaName = user.complexId ? await this.tenantService.getTenantSchemaName(user.complexId) : null;
    const payload = { email: user.email, sub: user.id, role: user.role, complexId: user.complexId, schemaName: schemaName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    return this.userService.createUser(data);
  }
}
