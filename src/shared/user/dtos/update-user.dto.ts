import { Status } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status: Status;
}
