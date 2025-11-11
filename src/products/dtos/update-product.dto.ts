// src/products/dto/update-product.dto.ts
import {
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'The name of the product',
    example: 'Wireless Mouse',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the product',
    example:
      'A high-quality wireless mouse with ergonomic design and long battery life.',
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description?: string;

  @ApiPropertyOptional({
    description: 'The price of the product in USD',
    example: 29.99,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number greater than 0' })
  price?: number;

  @ApiPropertyOptional({
    description: 'The available stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Stock must be a non-negative integer' })
  stock?: number;

  @ApiPropertyOptional({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
