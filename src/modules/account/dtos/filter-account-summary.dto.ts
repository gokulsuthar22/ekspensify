import { Expose } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { AccountSummaryPeriod } from '../account.interface';

export class FilterAccountSummeryDto {
  @Expose()
  @IsIn(['THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR'], {
    message: "`period` must be 'THIS_WEEK', 'THIS_MONTH' or 'THIS_YEAR'",
  })
  @IsString({ message: '`period` must be a string' })
  @IsOptional()
  period?: AccountSummaryPeriod;
}
