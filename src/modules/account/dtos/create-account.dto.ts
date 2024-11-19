import { AcType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @Expose()
  name: string;

  @Expose()
  @Type(() => Number)
  balance: number;

  @Expose()
  @IsIn(['BANK', 'WALLET'])
  type: AcType;

  @Expose()
  @IsOptional()
  icon?: string;
}
