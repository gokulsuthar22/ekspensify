import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppHttpException } from 'core/exceptions/http.exception';

// transform: true,
// // whitelist: true,
// stopAtFirstError: true,
// transformOptions: {
//   excludeExtraneousValues: true,
// },

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(object as object, {
      whitelist: true,
      stopAtFirstError: true,
    });
    if (errors.length > 0) {
      throw new AppHttpException(HttpStatus.BAD_REQUEST, 'Validation failed');
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
