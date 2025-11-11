import { Injectable } from '@nestjs/common';
import { createResponse } from './common/helpers/response.helper';
import { BaseResponseDto } from './common/dtos/base-response.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async healthCheck(): Promise<BaseResponseDto> {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'error';
    }
    return createResponse('Service is healthy', { status: 'ok', db: dbStatus });
  }
}
