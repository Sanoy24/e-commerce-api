import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { createResponse } from '../helpers/response.helper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let errors: string[];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || exception.message || 'Error';
      errors = Array.isArray(res.message) ? res.message : [message];
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Something went wrong';
      errors = [exception.message || 'Unknown error'];
    }

    response.status(status).json(createResponse(message, null, errors));
  }
}
