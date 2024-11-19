import { TxType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsIn } from 'class-validator';

export class CreateTransactionDto {
  @Expose({ name: 'account_id' })
  @Type(() => Number)
  accountId: number;

  @Expose({ name: 'category_id' })
  @Type(() => Number)
  categoryId: number;

  @Expose()
  @Type(() => Number)
  amount: number;

  @Expose()
  note: string;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'])
  type: TxType;
}
