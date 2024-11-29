import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpReason } from './http.reasons';

export interface AppHttpError {
  status: HttpStatus;
  message: string;
  reason?: string;
}

export class AppHttpException extends HttpException {
  constructor(status: HttpStatus, message: string, reason?: string) {
    super({ message, reason, status }, status);
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default error structure
    const error: AppHttpError = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      reason: HttpReason.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    };

    // Handle custom application exceptions
    if (exception instanceof AppHttpException) {
      const exceptionResponse = exception.getResponse() as AppHttpError;
      Object.assign(error, {
        status: exception.getStatus(),
        reason: exceptionResponse.reason,
        message: exceptionResponse.message,
      });
    }
    // Handle 404 route not found exception explicitly
    else if (exception instanceof NotFoundException) {
      delete error.reason;
      Object.assign(error, {
        status: exception.getStatus(),
        message: 'Route not found',
      });
    }
    // Handle unhandled exceptions
    else {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // Send structured error response
    response.status(error.status).json({ error });
  }
}
