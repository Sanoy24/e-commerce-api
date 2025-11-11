// src/orders/dto/create-order.dto.ts
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

class OrderItemDto {
  @ApiProperty({
    description: 'The unique ID of the product',
    example: 'uuid-for-product',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product to order (minimum 1)',
    example: 2,
  })
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of products to order',
    type: [OrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must include at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
