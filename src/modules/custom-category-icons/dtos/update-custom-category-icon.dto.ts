import { Expose } from 'class-transformer';

export class UpdateCustomCategoryIconDto {
  @Expose({ name: 'is_active' })
  isActive: boolean;
}
