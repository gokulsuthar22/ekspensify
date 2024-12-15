import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BudgetDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => Number)
  limit: number;

  @Expose()
  @Type(() => Number)
  spent: number;

  @Expose()
  account: any;

  @Expose()
  @Transform(({ obj }) => {
    return obj.categoryId
      ? {
          id: obj?.category?.id,
          name: obj?.category?.name,
          icon: obj?.category?.icon?.path,
        }
      : null;
  })
  category: any;

  @Expose()
  period: string;

  @Expose()
  type: string;

  @Expose({ name: 'startDate' })
  start_date: string;

  @Expose({ name: 'endDate' })
  @IsOptional()
  end_date?: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}
