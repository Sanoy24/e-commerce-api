import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationQueryDto } from './dtos/pagination-query.dto';

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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Prisma will only update provided fields
    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        category:
          updateProductDto.category !== undefined
            ? updateProductDto.category
            : existingProduct.category,
      },
    });
  }

  async findAll({ page = 1, limit = 10, search }: PaginationQueryDto) {
    const where =
      search && search.trim()
        ? { name: { contains: search.trim().toLowerCase() } } // , mode: 'insensitive' does not work on sqlite
        : {};

    const skip = (page - 1) * limit;

    const [products, totalSize] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalSize / limit);

    return {
      Success: true,
      Message: 'Products retrieved successfully',
      Object: products,
      PageNumber: page,
      PageSize: limit,
      TotalPages: totalPages,
      TotalSize: totalSize,
      Errors: [],
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
  async delete(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }
}
