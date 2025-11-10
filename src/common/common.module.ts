import { Module } from '@nestjs/common';
import { SecurityService } from './security/security.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1h' },
    }),
  ],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class CommonModule {}
