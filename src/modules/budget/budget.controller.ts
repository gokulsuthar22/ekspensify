import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { BudgetTransactionPaginatedResponseDto } from './dtos/budget-transaction-paginatated-response.dto';
import { BudgetReportPaginatedResponseDto } from './dtos/budget-report-paginatated-response.dto';
import { BudgetReportPaginationParamsDto } from './dtos/budget-report-pagination-params.dto';
import { BudgetTransactionPaginationParamsDto } from './dtos/budget-transaction-pagination-params.dto';
import { BudgetPaginatedResponseDto } from './dtos/budget-paginatated-response.dto';
import { BudgetPaginationParamsDto } from './dtos/budget-pagination-params.dto';

@Controller('budgets')
@UseGuards(AuthGuard, RoleGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(BudgetPaginatedResponseDto)
  findMany(
    @CurrentUser() user: any,
    @Query() query: BudgetPaginationParamsDto,
  ) {
    return this.budgetService.findMany({ ...query, userId: user.id });
  }

  @Get(':id/reports/:reportId/transactions')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(BudgetTransactionPaginatedResponseDto)
  findManyTransactions(
    @Param('id', ParseIntPipe) id: number,
    @Param('reportId', ParseIntPipe) reportId: number,
    @Query() query: BudgetTransactionPaginationParamsDto,
  ) {
    return this.budgetService.findManyBudgetTransactions({
      ...query,
      budgetId: id,
      reportId,
    });
  }

  @Get(':id/reports')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(BudgetReportPaginatedResponseDto)
  findManyBudgets(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: BudgetReportPaginationParamsDto,
  ) {
    return this.budgetService.findManyBudgetReports({ ...query, budgetId: id });
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
