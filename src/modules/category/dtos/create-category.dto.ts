import { Expose } from 'class-transformer';

export class CreateCategoryDto {
  @Expose()
  name: string;
}
