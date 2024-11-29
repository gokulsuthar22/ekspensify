import { TxType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  name: string;

  @Expose({ name: 'icon_id' })
  @Type(() => Number)
  iconId: number;

  @Expose()
  @IsOptional()
  @IsIn(['CREDIT', 'DEBIT'])
  type?: TxType;

  @Expose({ name: 'is_active' })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
