import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class EmailSignUpDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  name: string;
}
