import { AccountCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';

export class CreateAccountTypeDto {
  @Expose()
  name: string;

  @Expose()
  @IsIn(['BANK', 'WALLET'])
  category: AccountCategory;
}
