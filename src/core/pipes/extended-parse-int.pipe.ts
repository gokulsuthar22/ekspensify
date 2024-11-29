import { HttpStatus, ParseIntPipe } from '@nestjs/common';
import { AppHttpException } from '../exceptions/http.exception';

export class ExtentedParseIntPipe extends ParseIntPipe {
  async transform(value: string): Promise<number> {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new AppHttpException(HttpStatus.BAD_REQUEST, `Invalid id`);
    }
    return val;
  }
}
