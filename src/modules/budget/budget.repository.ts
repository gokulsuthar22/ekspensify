import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  BudgetListMeta,
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
    reportId: true,
    period: true,
    periodNo: true,
    type: true,
    status: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
    budgetAccounts: {
      select: {
        account: {
          select: {
            id: true,
            name: true,
            icon: true,
            balance: true,
          },
        },
      },
    },
    budgetCategories: {
      select: {
        category: {
          select: {
            id: true,
            name: true,
            icon: {
              select: {
                path: true,
              },
            },
            icFillColor: true,
          },
        },
      },
    },
  };

  private get Budget() {
    return this.prismaService.budget;
  }

  async create(data: CreateBudgetData) {
    const budget = await this.Budget.create({
      data: {
        ...data,
        budgetAccounts: { createMany: { data: data.budgetAccounts } },
        budgetCategories: { createMany: { data: data.budgetCategories } },
      },
      select: this.select,
    });
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
    const budget = await this.Budget.update({
      where,
      data,
      select: this.select,
    });
    return budget;
  }

  async findOneAndDelete(where: BudgetWhere) {
    const budget = await this.Budget.delete({ where, select: this.select });
    return budget;
  }

  async findMany(where?: FilterBudgetWhere) {
    const result = await this.Budget.groupBy({
      by: ['type', 'status'], // Group by 'type' and 'status'
      where: { userId: where.userId },
      _count: {
        id: true, // Count based on the 'id'
      },
    });

    // Extract counts from the grouped result
    const counts = {
      closed: result.find((item) => item.status === 'CLOSED')?._count.id || 0,
      running: result.find((item) => item.status === 'RUNNING')?._count.id || 0,
    };

    const budgets = await this.paginationService.paginate<
      Budget,
      BudgetListMeta
    >(
      this.Budget,
      {
        where,
        select: this.select,
        orderBy: { createdAt: 'desc' },
      },
      counts,
    );
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
          { budgetCategories: { some: { id: categoryId } } },
          { budgetAccounts: { some: { id: accountId } } },
        ],
      },
    });
    return budgets;
  }
}
