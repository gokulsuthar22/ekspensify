import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UpdateMeUserDto } from 'src/shared/user/dtos/update-me-user.dto';
import { UserDto } from 'src/shared/user/dtos/user.dto';
import { UserService } from 'src/shared/user/user.service';

@Controller('users/me')
@UseGuards(AuthGuard, RoleGuard)
export class MeController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Patch()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  updateMe(@CurrentUser() user: any, @Body() data: UpdateMeUserDto) {
    return this.userService.updateById(user.id, data);
  }
}
