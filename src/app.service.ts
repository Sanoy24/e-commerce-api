import { Injectable } from '@nestjs/common';
import { createResponse } from './common/helpers/response.helper';
import { BaseResponseDto } from './common/dtos/base-response.dto';

@Injectable()
export class AppService {
  healthCheck(): BaseResponseDto {
    return createResponse('Service is healthy', { status: 'ok' });
  }
}
