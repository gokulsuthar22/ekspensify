import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  type: string;

  @Expose()
  icon: string;

  @Expose({ name: 'userId' })
  user_id: number;

  @Expose({ name: 'isActive' })
  is_active: boolean;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;

  @Expose({ name: 'deletedAt' })
  deleted_at: Date;
}
