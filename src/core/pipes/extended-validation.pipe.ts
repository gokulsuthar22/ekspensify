import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppHttpException } from 'core/exceptions/http.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const data: object = plainToInstance(metatype, value, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(data, {
      whitelist: true,
      stopAtFirstError: true,
    });
    // if (errors.length > 0) {
    //   throw new AppHttpException(HttpStatus.BAD_REQUEST, 'Validation failed');
    // }
    return data;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
