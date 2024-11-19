import { Expose, Type } from 'class-transformer';

export class TransactionDto {
  @Expose()
  id: number;

  @Expose()
  account: any;

  @Expose()
  category: any;

  @Expose()
  attachment: any;

  @Expose()
  @Type(() => Number)
  amount: number;

  @Expose()
  note: string;

  @Expose()
  type: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
