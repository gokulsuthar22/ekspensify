import { TxType } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { contains, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '@/common/dtos/pagination-params.dto';

export class TransactionPaginationParamsDto extends PaginationParamsDto {
  @Expose({ name: 'account_ids' })
  @Transform(({ value }) => {
    return {
      in: value
        ?.split(',')
        ?.slice(0, 5)
        ?.map((v: string) => +v)
        ?.filter(Number.isFinite),
    };
  })
  @IsOptional()
  accountId?: { in: number[] };

  @Expose({ name: 'category_ids' })
  @Transform(({ value }) => {
    return {
      in: value
        ?.trim()
        ?.split(',')
        ?.slice(0, 5)
        ?.map((v: string) => +v)
        ?.filter(Number.isFinite),
    };
  })
  @IsOptional()
  @IsOptional()
  categoryId?: { in: number[] };

  @Expose({ name: 'amount' })
  @Transform(({ obj }) => {
    return {
      gte: +obj?.amount?.gte || undefined,
      lte: +obj?.amount?.lte || undefined,
    };
  })
  @IsOptional()
  amount?: { gte: number; lte: number };

  @Expose({ name: 'created_at' })
  @Transform(({ obj }) => {
    return {
      gte: obj?.created_at?.gte ? new Date(obj?.created_at?.gte) : undefined,
      lte: obj?.created_at?.lte ? new Date(obj?.created_at?.lte) : undefined,
    };
  })
  @IsOptional()
  createdAt?: { gte: string; lte: string };

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'], { message: "`type` must be 'CREDIT' or 'DEBIT'" })
  @IsString({ message: '`type` must be a string' })
  @IsOptional()
  type?: TxType;

  @Expose({ name: 'q' })
  @Transform(({ obj }) => {
    return { contains: obj?.q || undefined };
  })
  @IsOptional()
  slug: { contains: string };

  // @Expose({ name: 'sort_by' })
  // @Transform(({ obj }) => {
  //   return {
  //     createdAt: obj?.sort_by?.created_at,
  //     amount: obj?.sort_by?.amount,
  //   };
  // })
  // @IsOptional()
  // sortBy: string;
}
