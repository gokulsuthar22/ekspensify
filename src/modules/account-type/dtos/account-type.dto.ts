import { Expose } from 'class-transformer';

export class AccountTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  category: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}
