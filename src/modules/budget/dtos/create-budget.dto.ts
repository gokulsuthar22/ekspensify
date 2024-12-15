import { BudgetPeriod, BudgetType } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateBudgetDto {
  @Expose()
  @IsNumber({}, { message: '`limit` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  limit: number;

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
  @IsIn(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'], {
    message:
      "`period` must be 'DAILY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY' or 'YEARLY'",
  })
  @IsString({ message: '`period` must be a string' })
  @IsNotEmpty()
  period: BudgetPeriod;

  @Expose()
  @IsIn(['RECURRING', 'EXPIRING'], {
    message: "`type` must be 'RECURRING' or 'EXPIRING'",
  })
  @IsString({ message: '`type` must be a string' })
  @IsNotEmpty()
  type: BudgetType;

  @Expose({ name: 'start_date' })
  @Transform(({ obj }) => {
    return obj?.start_date ? new Date(obj.start_date) : new Date();
  })
  @IsNotEmpty()
  startDate: string;

  @Expose({ name: 'end_date' })
  @Transform(({ obj }) => {
    return obj?.end_date ? new Date(obj.end_date) : undefined;
  })
  @ValidateIf((o: CreateBudgetDto) => o.type === 'EXPIRING')
  @IsNotEmpty()
  endDate?: string;
}
