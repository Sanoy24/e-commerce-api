import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
      order: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    const dto = {
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 1 },
      ],
    } as any;

    it('creates order successfully and reduces stock', async () => {
      const tx = {
        product: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({ id: 'p1', name: 'A', price: 10, stock: 5 })
            .mockResolvedValueOnce({ id: 'p2', name: 'B', price: 20, stock: 3 }),
          update: jest.fn(),
        },
        order: {
          create: jest.fn().mockResolvedValue({ id: 'o1' }),
          findUnique: jest.fn().mockResolvedValue({ id: 'o1', totalPrice: 40 }),
        },
        orderItem: {
          createMany: jest.fn(),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

      const res = await service.createOrder(dto, 'u1');
      expect(res.success).toBe(true);
      expect(res.message).toBe('Order created successfully');
      expect(tx.product.update).toHaveBeenCalledTimes(2);
      expect(tx.product.update).toHaveBeenNthCalledWith(1, {
        where: { id: 'p1' },
        data: { stock: 3 },
      });
      expect(tx.product.update).toHaveBeenNthCalledWith(2, {
        where: { id: 'p2' },
        data: { stock: 2 },
      });
    });

    it('throws NotFoundException when product not found', async () => {
      const tx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      } as any;
      prisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

      await expect(service.createOrder(dto, 'u1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws BadRequestException on insufficient stock', async () => {
      const tx = {
        product: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({ id: 'p1', name: 'A', price: 10, stock: 1 }),
        },
      } as any;
      prisma.$transaction.mockImplementation(async (cb: any) => cb(tx));

      await expect(
        service.createOrder({ items: [{ productId: 'p1', quantity: 2 }] } as any, 'u1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findUserOrders', () => {
    it('returns orders for user', async () => {
      prisma.order.findMany.mockResolvedValue([{ id: 'o1', totalPrice: 10 }]);
      const res = await service.findUserOrders('u1');
      expect(res.success).toBe(true);
      expect(res.message).toBe('Orders fetched successfully');
      expect(res.object).toEqual([{ id: 'o1', totalPrice: 10 }]);
    });
  });
});
