import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/shared/user/dtos/user.dto';

export class AuthResponseDto {
  @Expose()
  token: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
