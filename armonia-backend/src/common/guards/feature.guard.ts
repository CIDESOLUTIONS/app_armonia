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

    async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
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

    const subscriptions = await this.plansService.findSubscriptionsByComplex(user.residentialComplexId);
    const activeSubscription = subscriptions.find(s => s.status === 'ACTIVE' || s.status === 'TRIAL');

    if (!activeSubscription) {
      throw new ForbiddenException('No active subscription found for this complex.');
    }

    // Check if the user's plan supports all required features
    for (const feature of requiredFeatures) {
      const accessCheck = await this.plansService.checkFeatureAccess({ subscriptionId: activeSubscription.id, feature });
      if (!accessCheck.hasAccess) {
        throw new ForbiddenException(`Your current plan does not support this feature: ${feature}. Reason: ${accessCheck.reason}`);
      }
    }

    return true;
  }
}
