import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class PaginatedResponseDto<T = any> extends BaseResponseDto<T[]> {
  @ApiProperty({ example: 1 })
  pageNumber: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 100 })
  totalSize: number;

  constructor(
    success: boolean,
    message: string,
    object: T[],
    pageNumber: number,
    pageSize: number,
    totalSize: number,
    errors: string[] | null = null,
  ) {
    super(success, message, object, errors);
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalSize = totalSize;
  }
}
