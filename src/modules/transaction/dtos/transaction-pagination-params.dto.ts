import { TxType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationParamsDto } from 'common/dtos/pagination-params.dto';

export class TransactionPaginationParamsDto extends PaginationParamsDto {
  @Expose({ name: 'account_id' })
  @IsOptional()
  @Type(() => Number)
  accountId?: number;

  @Expose({ name: 'category_id' })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'])
  @IsOptional()
  type?: TxType;
}
