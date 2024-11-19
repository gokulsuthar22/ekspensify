import { TxType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  name: string;

  @Expose()
  @IsOptional()
  @IsIn(['CREDIT', 'DEDIT'])
  type?: TxType;

  @Expose()
  @IsOptional()
  icon?: string;
}
