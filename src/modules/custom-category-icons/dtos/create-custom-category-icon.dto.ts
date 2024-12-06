import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCustomCategoryIconDto {
  @Expose({ name: 'icon_id' })
  @IsNumber({}, { message: '`icon_id` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  iconId: number;

  @Expose({ name: 'is_active' })
  @IsBoolean({ message: '`is_active` must be a boolean' })
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;
}
