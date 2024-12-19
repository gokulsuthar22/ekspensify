import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  BudgetWhere,
  CreateBudgetData,
  FilterBudgetWhere,
  UpdateBudgetData,
} from './budget.interface';
import { Budget } from '@prisma/client';
import { PaginationService } from '@/common/services/pagination.service';

@Injectable()
export class BudgetRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private select = {
    id: true,
    limit: true,
    spent: true,
    userId: true,
    accountIds: true,
    categoryIds: true,
    reportId: true,
    period: true,
    periodNo: true,
    type: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
    accounts: {
      select: {
        id: true,
        name: true,
        icon: true,
      },
    },
    categories: {
      select: {
        id: true,
        name: true,
        icon: {
          select: {
            path: true,
          },
        },
      },
    },
  };

  private get Budget() {
    return this.prismaService.budget;
  }

  async create(data: CreateBudgetData) {
    const budget = await this.Budget.create({ data, select: this.select });
    return budget;
  }

  async findById(id: number) {
    const budget = await this.Budget.findUnique({
      where: { id },
      select: this.select,
    });
    return budget;
  }

  async updateById(id: number, data: UpdateBudgetData) {
    const budget = await this.Budget.update({
      where: { id },
      data,
      select: this.select,
    });
    return budget;
  }

  async deleteById(id: number, data: UpdateBudgetData) {
    const budget = await this.Budget.delete({
      where: { id },
      select: this.select,
    });
    return budget;
  }

  async findOne(where: BudgetWhere) {
    const budget = await this.Budget.findFirst({ where, select: this.select });
    return budget;
  }

  async findOneAndUpdate(where: BudgetWhere, data: UpdateBudgetData) {
    const budget = await this.Budget.update({ where, data });
    return budget;
  }

  async findOneAndDelete(where: BudgetWhere) {
    const budget = await this.Budget.delete({ where, select: this.select });
    return budget;
  }

  async findMany(where?: FilterBudgetWhere) {
    const budgets = await this.paginationService.paginate<Budget>(this.Budget, {
      where,
      select: this.select,
      orderBy: { createdAt: 'desc' },
    });
    return budgets;
  }

  async findActiveBudgetsByDate(
    userId: number,
    date: Date,
    accountId?: number,
    categoryId?: number,
  ) {
    const budgets = await this.Budget.findMany({
      where: {
        userId: userId,
        startDate: { lte: date },
        OR: [
          { endDate: { gte: date } },
          { endDate: null },
          { accountIds: { has: accountId } },
          { categoryIds: { has: categoryId } },
        ],
      },
    });
    return budgets;
  }
}
