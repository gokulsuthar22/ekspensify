import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class EmailSignInDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  otp: number;
}
