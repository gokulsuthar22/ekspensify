import { Expose, Transform, Type } from 'class-transformer';

export class AccountDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) => obj.accountType.name)
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.accountType.slug)
  slug: string;

  @Expose()
  @Transform(({ obj }) => obj.accountType.category)
  type: string;

  @Expose()
  @Type(() => Number)
  balance: number;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
