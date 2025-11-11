// common/common.module.ts
import { Module } from '@nestjs/common';
import { SecurityService } from './security/security.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '1h';
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SecurityService, AuthGuard, CustomThrottlerGuard],
  exports: [SecurityService, JwtModule, AuthGuard, CustomThrottlerGuard],
})
export class CommonModule {}
