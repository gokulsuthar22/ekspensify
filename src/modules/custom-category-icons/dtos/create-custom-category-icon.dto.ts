import { Expose, Type } from 'class-transformer';

export class CreateCustomCategoryIconDto {
  @Expose({ name: 'icon_id' })
  @Type(() => Number)
  iconId: number;

  @Expose({ name: 'is_active' })
  isActive: boolean;
}
