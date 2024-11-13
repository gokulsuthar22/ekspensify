import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterCategoryDto {
  @Expose()
  @IsOptional()
  slug?: string;

  @Expose({ name: 'is_active' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  OR: any;
}
