import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SecurityService } from 'src/common/security/security.service';
import { UsersService } from 'src/users/users.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let securityService: any;
  let usersService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    securityService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
      generateToken: jest.fn(),
    };

    usersService = {
      getUserByUsername: jest.fn(),
      getUserByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: SecurityService, useValue: securityService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      username: 'john',
      email: 'john@example.com',
      password: 'password123',
    };

    it('throws ConflictException when username exists', async () => {
      usersService.getUserByUsername.mockResolvedValue({ id: 'u1' });

      await expect(service.register(registerDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('throws ConflictException when email exists', async () => {
      usersService.getUserByUsername.mockResolvedValue(null);
      usersService.getUserByEmail.mockResolvedValue({ id: 'u1' });

      await expect(service.register(registerDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('registers successfully and returns safe user info', async () => {
      usersService.getUserByUsername.mockResolvedValue(null);
      usersService.getUserByEmail.mockResolvedValue(null);
      securityService.hashPassword.mockResolvedValue('hashed');
      prisma.user.create.mockResolvedValue({ id: 'u1' });
      const safeUser = {
        id: 'u1',
        username: registerDto.username,
        email: registerDto.email,
        createdAt: new Date(),
      };
      prisma.user.findUnique.mockResolvedValue(safeUser);

      const res = await service.register(registerDto as any);
      expect(res.success).toBe(true);
      expect(res.message).toBe('User registered successfully');
      expect(res.object).toEqual(safeUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { username: 'john', email: 'john@example.com', password: 'hashed' },
      });
    });
  });

  describe('login', () => {
    const loginDto = { email: 'john@example.com', password: 'password123' };

    it('throws UnauthorizedException when email not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      await expect(service.login(loginDto as any)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when password mismatch', async () => {
      usersService.getUserByEmail.mockResolvedValue({
        id: 'u1',
        username: 'john',
        password: 'hashed',
        role: 'CUSTOMER',
      });
      securityService.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto as any)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('returns token on successful login', async () => {
      usersService.getUserByEmail.mockResolvedValue({
        id: 'u1',
        username: 'john',
        password: 'hashed',
        role: 'CUSTOMER',
      });
      securityService.comparePassword.mockResolvedValue(true);
      securityService.generateToken.mockResolvedValue({ accessToken: 'abc123' });

      const res = await service.login(loginDto as any);
      expect(res.success).toBe(true);
      expect(res.message).toBe('Login successful');
      // AuthService wraps the securityService result under { token }
      expect(res.object).toEqual({ token: { accessToken: 'abc123' } });
    });
  });
});
