import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TenantModule } from '../tenant/tenant.module';

import { ResidentialComplexModule } from '../residential-complex/residential-complex.module';

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
