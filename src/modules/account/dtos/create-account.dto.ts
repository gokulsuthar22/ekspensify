import { Expose, Type } from 'class-transformer';

export class CreateAccountDto {
  @Expose({ name: 'account_type_id' })
  accountTypeId: string;

  @Expose()
  @Type(() => Number)
  balance: number;
}
