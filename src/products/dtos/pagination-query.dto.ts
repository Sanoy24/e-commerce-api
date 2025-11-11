// src/products/dto/pagination-query.dto.ts
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'The page number to retrieve (defaults to 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description:
      'The number of products per page (defaults to 10). Also accepts "pageSize" as alias.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Search term for product name (case-insensitive partial match). If empty or not provided, returns all products.',
    example: 'mouse',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // To support 'pageSize' as alias, handle in controller if needed
}
