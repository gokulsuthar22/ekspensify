import { Injectable } from '@nestjs/common';
import { BudgetRepository } from './budget.repository';
import {
  BudgetWhere,
  CreateBudgetData,
  FilterBudgetWhere,
  UpdateBudgetData,
} from './budget.interface';

@Injectable()
export class BudgetService {
  constructor(private budgetRepo: BudgetRepository) {}

  async create(data: CreateBudgetData) {
    const budget = await this.budgetRepo.create(data);
    return budget;
  }

  async update(where: BudgetWhere, data?: UpdateBudgetData) {
    const budget = await this.budgetRepo.findOneAndUpdate(where, data);
    return budget;
  }

  async delete(where: BudgetWhere) {
    const budget = await this.budgetRepo.findOneAndDelete(where);
    return budget;
  }

  async findMany(where?: FilterBudgetWhere) {
    const budgets = await this.budgetRepo.findMany(where);
    return budgets;
  }
}
