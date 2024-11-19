import { Expose } from 'class-transformer';
import { PaginationParamsDto } from 'common/dtos/pagination-params.dto';

export class UserPaginationParamsDto extends PaginationParamsDto {
  @Expose()
  name: string;

  @Expose()
  email: string;
}
