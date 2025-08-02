import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlansService } from '../../plans/plans.service'; // Adjust path as needed
import { Observable } from 'rxjs';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private plansService: PlansService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredFeatures = this.reflector.get<string[]>(
      'features',
      context.getHandler(),
    );

    if (!requiredFeatures) {
      return true; // No specific features required for this route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user is attached by JwtAuthGuard and TenantInterceptor

    if (!user || !user.residentialComplexId) {
      throw new ForbiddenException('Authentication required for this feature.');
    }

    // Check if the user's plan supports all required features
    const hasAccess = requiredFeatures.every((feature) =>
      this.plansService.checkFeatureAccess(user.residentialComplexId, feature),
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'Your current plan does not support this feature.',
      );
    }

    return true;
  }
}
