import { Expose } from 'class-transformer';

export class UpdateMeUserDto {
  @Expose()
  name: string;
}
