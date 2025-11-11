import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserByUsername delegates to prisma', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', username: 'john' });
    const res = await service.getUserByUsername('john');
    expect(res).toEqual({ id: 'u1', username: 'john' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'john' } });
  });

  it('getUserByEmail delegates to prisma', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
    const res = await service.getUserByEmail('a@b.com');
    expect(res).toEqual({ id: 'u1', email: 'a@b.com' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
  });
});
