import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      product: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates product successfully', async () => {
      const dto = { name: 'P1', price: 10, stock: 5 } as any;
      const product = { id: 'p1', ...dto, userId: 'u1' };
      prisma.product.create.mockResolvedValue(product);

      const res = await service.create(dto, 'u1');
      expect(res.success).toBe(true);
      expect(res.message).toBe('Product create Succssfully');
      expect(res.object).toEqual(product);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 'u1' },
      });
    });

    it('throws ConflictException on unique violation', async () => {
      prisma.product.create.mockRejectedValue({ code: 'P2002' });
      await expect(
        service.create({ name: 'P1', price: 10, stock: 5 } as any, 'u1'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('update', () => {
    it('throws NotFoundException when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(
        service.update('p1', { name: 'New' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('updates product with provided fields and preserves category', async () => {
      const existing = { id: 'p1', category: 'cat1' };
      prisma.product.findUnique.mockResolvedValue(existing);
      const updated = { id: 'p1', name: 'New', category: 'cat1' } as any;
      prisma.product.update.mockResolvedValue(updated);

      const res = await service.update('p1', { name: 'New' } as any);
      expect(res.success).toBe(true);
      expect(res.message).toBe('Product Updated Succssfully');
      await expect(res.object).resolves.toEqual(updated);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { name: 'New', category: 'cat1' },
      });
    });
  });

  describe('findAll', () => {
    it('returns paginated products', async () => {
      prisma.product.findMany.mockResolvedValue([
        { id: 'p1', name: 'a', price: 10, stock: 1, category: null },
      ]);
      prisma.product.count.mockResolvedValue(1);

      const res = await service.findAll({ page: 1, limit: 10 } as any);
      expect(res.success).toBe(true);
      expect(res.message).toBe('Products retrieved successfully');
      expect(res.object.length).toBe(1);
      expect(res.pageNumber).toBe(1);
      expect(res.pageSize).toBe(10);
      expect(res.totalSize).toBe(1);
    });
  });

  describe('findOne', () => {
    it('returns product when found', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'p1' });
      const res = await service.findOne('p1');
      expect(res.success).toBe(true);
      expect(res.message).toBe('Product fetched successfully');
      expect(res.object).toEqual({ id: 'p1' });
    });

    it('throws NotFoundException when not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.findOne('p1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('throws NotFoundException when not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.delete('p1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('deletes product successfully', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'p1' });
      prisma.product.delete.mockResolvedValue({});
      const res = await service.delete('p1');
      expect(res.success).toBe(true);
      expect(res.message).toBe('Product deleted successfully');
      expect(res.object).toBeNull();
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
    });
  });
});
