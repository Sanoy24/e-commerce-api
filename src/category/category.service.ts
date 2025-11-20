import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
      },
    });
    return category;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async findOne(id: string) {
    const categories = await this.prisma.category.findFirst({
      where: {
        id: id,
      },
    });
    return categories;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.prisma.category.update({
      where: { id: id },
      data: { ...updateCategoryDto },
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.category.delete({ where: { id } });
    return result;
  }
}
