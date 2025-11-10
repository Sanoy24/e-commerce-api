import { SecurityService } from 'src/common/security/security.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly securityService: SecurityService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }
    const hashedPassword = await this.securityService.hashPassword(password);
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    return this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, username: true, email: true, createdAt: true },
    });
  }
}
