import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponseDto } from './common/dtos/base-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthcheck')
  @ApiOperation({
    summary: 'Server Healthcheck endpoint',
    description: 'Checks whether the server is healthy',
  })
  @ApiResponse({
    status: 200,
    description: 'Healthy',
    schema: {
      example: {
        success: true,
        message: 'Service is healthy',
        object: {
          status: 'ok',
        },
        errors: null,
      },
    },
  })
  heakthCheck(): BaseResponseDto {
    return this.appService.healthCheck();
  }
}
