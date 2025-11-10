import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Request completed successfully' })
  message: string;

  @ApiProperty({ example: {}, description: 'Response object, can be any JSON' })
  object: T;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'List of error messages, or null if no errors',
  })
  errors: string[] | null;

  constructor(
    success: boolean,
    message: string,
    object: T,
    errors: string[] | null = null,
  ) {
    this.success = success;
    this.message = message;
    this.object = object;
    this.errors = errors;
  }
}
