// src/orders/dto/order-summary.dto.ts (For list response)
import { ApiProperty } from '@nestjs/swagger';

export class OrderSummaryDto {
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
    description: 'The creation date of the order',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date; // Assuming added to Prisma model: createdAt DateTime @default(now())
}
