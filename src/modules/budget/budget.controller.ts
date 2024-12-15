import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { Roles } from '@/core/decorators/roles.decorator';
import { Serialize } from '@/core/interceptors/serialize.interceptor';
import { Role } from '@prisma/client';
import { ParseIntPipe } from '@/core/pipes/parse-int.pipe';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { BudgetDto } from './dtos/budget.dto';
import { CreateBudgetDto } from './dtos/create-budget.dto';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RoleGuard } from '@/core/guards/role.guard';

@Controller('budgets')
@UseGuards(AuthGuard, RoleGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(BudgetDto)
  findMany(@CurrentUser() user: any) {
    return this.budgetService.findMany({ userId: user.id });
  }

  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(BudgetDto)
  create(@CurrentUser() user: any, @Body() data: CreateBudgetDto) {
    return this.budgetService.create({ ...data, userId: user.id });
  }

  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(BudgetDto)
  delete(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.delete({ id, userId: user.id });
  }
}
