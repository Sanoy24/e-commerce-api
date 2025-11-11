// src/products/dto/product.dto.ts (New: Full product details for single response)
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'The unique ID of the product',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Wireless Mouse',
  })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product',
    example:
      'A high-quality wireless mouse with ergonomic design and long battery life.',
  })
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 29.99,
  })
  price: number;

  @ApiProperty({
    description: 'The available stock quantity',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'The category of the product (optional)',
    example: 'Electronics',
    required: false,
  })
  category?: string;
}
