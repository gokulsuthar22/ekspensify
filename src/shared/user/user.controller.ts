import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from 'src/core/interceptors/serialize.interceptor';
import { UserPaginatedResponseDto } from './dtos/user-paginatated-response.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserPaginatedResponseDto)
  findMany(@Query() filter: any) {
    filter.role = 'USER';
    return this.userService.findMany(filter);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  updateById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.updateById(id, data);
  }
}
