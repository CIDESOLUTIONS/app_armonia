import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService } from '../../tenant/tenant.service'; // Restored original path

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private tenantService: TenantService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Asumimos que el usuario ya está adjunto por el guardia JWT

    if (user && user.residentialComplexId) {
      const schemaName = await this.tenantService.getTenantSchemaName(
        user.residentialComplexId,
      );
      if (schemaName) {
        request.user.schemaName = schemaName; // Adjuntar schemaName al objeto de usuario en la solicitud
      }
    }

    return next.handle();
  }
}
