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
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RoleGuard } from 'src/core/guards/role.guard';
import { AccountService } from './account.service';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from 'src/core/interceptors/serialize.interceptor';
import { AccountDto } from './dtos/account.dto';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { FilterAccountDto } from './dtos/filter-account.dto';

@Controller('accounts')
@UseGuards(AuthGuard, RoleGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(AccountDto)
  create(@CurrentUser() user: any, @Body() data: CreateAccountDto) {
    return this.accountService.createOne({ ...data, userId: user.id });
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  findMany(@Query() where: FilterAccountDto) {
    return this.accountService.findMany(where);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  find(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accountService.findOne({ id, userId: user.id });
  }

  @Patch(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() data: UpdateAccountDto,
  ) {
    return this.accountService.updateOne({ id, userId: user.id }, data);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(AccountDto)
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accountService.deleteOne({ id, userId: user.id });
  }
}
