import { TxType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/common/dtos/pagination-params.dto';

export class TransactionPaginationParamsDto extends PaginationParamsDto {
  @Expose({ name: 'account_id' })
  @IsNumber({}, { message: '`account_id` must be a number' })
  @Type(() => Number)
  @IsOptional()
  accountId?: number;

  @Expose({ name: 'category_id' })
  @IsNumber({}, { message: '`category_id` must be a number' })
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'], { message: "`type` must be 'CREDIT' or 'DEBIT'" })
  @IsString({ message: '`type` must be a string' })
  @IsOptional()
  type?: TxType;
}
