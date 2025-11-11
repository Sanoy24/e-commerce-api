import { SecurityService } from 'src/common/security/security.service';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { create } from 'domain';
import { createResponse } from 'src/common/helpers/response.helper';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly securityService: SecurityService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto): Promise<BaseResponseDto> {
    const { username, email, password } = registerDto;

    // Check username
    const existingUsername = await this.userService.getUserByUsername(username);
    if (existingUsername) throw new ConflictException('Username already taken');

    // Check email
    const existingEmail = await this.userService.getUserByEmail(email);
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
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await this.securityService.comparePassword(
      password,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = await this.securityService.generateToken(payload);
    return createResponse('Login successful', { token });
  }
}
