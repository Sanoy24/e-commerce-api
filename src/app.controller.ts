import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponseDto } from './common/dtos/base-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthcheck')
  heakthCheck(): BaseResponseDto {
    return this.appService.healthCheck();
  }
}
