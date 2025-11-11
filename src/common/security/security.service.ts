import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
  constructor(private jwtService: JwtService) {}
  logger = new Logger(SecurityService.name);

  async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(process.env.SALT_VALUE);
    return await bcrypt.hash(password, saltRounds);
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(
    payload: Record<string, any>,
  ): Promise<{ accessToken: string }> {
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  // 🧾 Verify JWT token (optional helper)
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
