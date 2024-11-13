import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class SendOtpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email must be provided' })
  @Expose()
  email: string;
}
