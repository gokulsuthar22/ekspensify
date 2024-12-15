import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  BudgetWhere,
  CreateBudgetData,
  FilterBudgetWhere,
  UpdateBudgetData,
} from './budget.interface';

@Injectable()
export class BudgetRepository {
  constructor(private prismaService: PrismaService) {}

  private select = {
    id: true,
    limit: true,
    spent: true,
    userId: true,
    accountId: true,
    categoryId: true,
    period: true,
    type: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
    account: {
      select: {
        id: true,
        name: true,
        icon: true,
      },
    },
    category: {
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
    const budgets = await this.Budget.findMany({ where, select: this.select });
    return budgets;
  }
}
