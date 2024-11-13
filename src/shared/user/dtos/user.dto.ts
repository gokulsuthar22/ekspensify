import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  role: string;

  @Expose()
  status: string;

  @Expose({ name: 'isVerified' })
  is_verified: boolean;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}
