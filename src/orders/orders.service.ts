import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      let totalPrice = 0;

      // Fetch and validate products
      const products = await Promise.all(
        createOrderDto.items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, price: true, stock: true },
          });

          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for ${product.name}`,
            );
          }

          totalPrice += product.price * item.quantity;

          return { ...product, quantity: item.quantity };
        }),
      );

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'pending',
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: createOrderDto.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Update product stocks
      await Promise.all(
        products.map((p) =>
          tx.product.update({
            where: { id: p.id },
            data: { stock: p.stock - p.quantity },
          }),
        ),
      );

      // Fetch and return full order details
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        totalPrice: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }, // Optional: sort by recent first
    });
  }
}
