import { AccountSummaryPeriod } from '@/modules/account/account.interface';
import { TxType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterCategoryInsightsDto {
  @Expose()
  @IsIn(['THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR'], {
    message: "`period` must be 'THIS_WEEK', 'THIS_MONTH' or 'THIS_YEAR'",
  })
  @IsString({ message: '`period` must be a string' })
  @IsOptional()
  period?: AccountSummaryPeriod;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'], {
    message: "`period` must be 'CREDIT' or 'DEBIT'",
  })
  @IsString({ message: '`type` must be a string' })
  @IsOptional()
  type?: TxType;
}
