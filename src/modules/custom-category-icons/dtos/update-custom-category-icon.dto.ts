import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCustomCategoryIconDto {
  @Expose({ name: 'is_active' })
  @IsBoolean({ message: '`is_active` must be a boolean' })
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;
}
