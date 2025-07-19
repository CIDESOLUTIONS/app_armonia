import {
  Injectable,
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

export const RolesGuard = (roles: UserRole[]): Type<CanActivate> => {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user; // Asumiendo que el usuario está adjunto a la solicitud por JwtAuthGuard

      return requiredRoles.some((role) => user.role === role);
    }
  }
  return mixin(RolesGuardMixin);
};
