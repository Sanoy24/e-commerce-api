// src/orders/dto/order-response.dto.ts (For Swagger response type)
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../products/dtos/product.dto'; // Reuse from products

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'The product details',
    type: ProductDto,
  })
  product: ProductDto;

  @ApiProperty({
    description: 'The quantity ordered',
    example: 2,
  })
  quantity: number;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'The unique ID of the order',
    example: 'uuid-for-order',
  })
  id: string;

  @ApiProperty({
    description: 'The status of the order',
    example: 'pending',
  })
  status: string;

  @ApiProperty({
    description: 'The total price of the order',
    example: 59.98,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'The list of ordered items',
    type: [OrderItemResponseDto],
  })
  orderItems: OrderItemResponseDto[];
}
