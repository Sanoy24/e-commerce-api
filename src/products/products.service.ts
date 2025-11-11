import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId: userId,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new ConflictException('Product with this name already exists');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }
}
