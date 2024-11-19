import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Roles } from 'core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from 'core/interceptors/serialize.interceptor';
import { CurrentUser } from 'core/decorators/current-user.decorator';
import { AuthGuard } from 'core/guards/auth.guard';
import { RoleGuard } from 'core/guards/role.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionDto } from './dtos/transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard, RoleGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: any, @Body() data: CreateTransactionDto) {
    return this.transactionService.create({
      ...data,
      userId: user.id,
    });
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(TransactionDto)
  findMany(@CurrentUser() user: any, @Query() where: any) {
    return this.transactionService.findMany({
      ...where,
      userId: user.role !== 'ADMIN' ? user.id : undefined,
    });
  }
}
