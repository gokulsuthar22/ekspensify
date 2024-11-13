import { AccountCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class FilterAccountTypeDto {
  @Expose()
  @IsOptional()
  slug?: string;

  @Expose()
  @IsIn(['BANK', 'WALLET'])
  @IsOptional()
  category?: AccountCategory;
}
