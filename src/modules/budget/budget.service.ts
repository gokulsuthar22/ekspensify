import { Injectable } from '@nestjs/common';
import { BudgetRepository } from './budget.repository';
import {
  BudgetWhere,
  CreateBudgetData,
  FilterBudgetWhere,
  UpdateBudgetData,
} from './budget.interface';
import { BudgetReportRepository } from './repositories/budget-report.repository';
import { BudgetTransactionRepository } from './repositories/budget-transaction.repository';
import * as moment from 'moment';

@Injectable()
export class BudgetService {
  constructor(
    private budgetRepo: BudgetRepository,
    private budgetReportRepo: BudgetReportRepository,
    private budgetTransactionRepo: BudgetTransactionRepository,
  ) {}

  async create(data: Omit<CreateBudgetData, 'reportId'>) {
    let budget = await this.budgetRepo.create(data);
    // week, year, quater, month
    const period = budget.period.toLowerCase().replace('ly', '');
    // period start based on the current running period
    const periodStart = moment().utc();
    // period end based on the current running period
    const periodEnd = moment()
      .utc()
      .endOf(period as moment.unitOfTime.StartOf);
    // create budget report for current period
    const report = await this.budgetReportRepo.create({
      budgetId: budget.id,
      amount: 0,
      periodNo: budget.periodNo,
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
    });
    budget = await this.budgetRepo.updateById(budget.id, {
      reportId: report.id,
    });
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

  async findManyBudgetTransactions(where?: any) {
    const budgetTransactions = await this.budgetTransactionRepo.findMany(where);
    budgetTransactions.items = budgetTransactions.items.map(
      (t: any) => t.transaction,
    );
    return budgetTransactions;
  }

  async findManyBudgetReports(where?: any) {
    const budgetReports = await this.budgetReportRepo.findMany(where);
    return budgetReports;
  }
}
