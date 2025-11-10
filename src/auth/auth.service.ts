import { SecurityService } from 'src/common/security/security.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { create } from 'domain';
import { createResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityService: SecurityService,
  ) {}

  async register(registerDto: RegisterDto): Promise<BaseResponseDto> {
    const { username, email, password } = registerDto;

    // Check username
    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) throw new ConflictException('Username already taken');

    // Check email
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail)
      throw new ConflictException('Email is already registered');

    // Hash password
    const hashedPassword = await this.securityService.hashPassword(password);

    // Create user
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    // Return safe user info
    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, username: true, email: true, createdAt: true },
    });

    return createResponse('User registered successfully', userData);
  }
}
