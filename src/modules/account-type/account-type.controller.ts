import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountTypeService } from './account-type.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from 'src/core/interceptors/serialize.interceptor';
import { AccountTypeDto } from './dtos/account-type.dto';
import { CreateAccountTypeDto } from './dtos/create-account-type.dto';
import { UpdateAccountTypeDto } from './dtos/update-account-type.dto';
import { FilterAccountTypeDto } from './dtos/filter-account-type.dto';

@Controller('accounts/types')
@UseGuards(AuthGuard, RoleGuard)
export class AccountTypeController {
  constructor(private accountTypeService: AccountTypeService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(AccountTypeDto)
  create(@Body() data: CreateAccountTypeDto) {
    return this.accountTypeService.create(data);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountTypeDto)
  findMany(@Query() where: FilterAccountTypeDto) {
    return this.accountTypeService.findMany(where);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountTypeDto)
  update(@Param('id') id: string, @Body() data: UpdateAccountTypeDto) {
    return this.accountTypeService.updateById(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountTypeDto)
  delete(@Param('id') id: string) {
    return this.accountTypeService.deleteById(id);
  }
}
