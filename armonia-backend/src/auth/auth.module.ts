import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.js';
import { TenantModule } from '../tenant/tenant.module.js';

import { ResidentialComplexModule } from '../residential-complex/residential-complex.module.js';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TenantModule,
    ResidentialComplexModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET_KEY || 'superSecretKeyThatShouldBeLongAndRandom',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: JwtStrategy,
      useFactory: () =>
        new JwtStrategy(
          process.env.JWT_SECRET_KEY ||
            'superSecretKeyThatShouldBeLongAndRandom',
        ),
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
