import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new HttpException(
      'Too many requests! Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
