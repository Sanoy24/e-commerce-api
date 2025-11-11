import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Wireless Mouse',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product',
    example:
      'A high-quality wireless mouse with ergonomic design and long battery life.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @ApiProperty({
    description: 'The price of the product in USD',
    example: 29.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number greater than 0' })
  price: number;

  @ApiProperty({
    description: 'The available stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0, { message: 'Stock must be a non-negative integer' })
  stock: number;

  @ApiPropertyOptional({
    description: 'The category of the product (optional)',
    example: 'Electronics',
  })
  @IsString()
  @IsOptional()
  category?: string;
}
