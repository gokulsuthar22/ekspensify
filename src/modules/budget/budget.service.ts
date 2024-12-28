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
    const currentDate = moment().utc();
    const periodUnit = budget.period
      .toLowerCase()
      .replace('ly', '') as moment.unitOfTime.DurationConstructor;
    const periodStartDate = currentDate.toDate();
    const periodEndDate = currentDate.clone().add(1, periodUnit).toDate();
    // create budget report for current period
    const report = await this.budgetReportRepo.create({
      budgetId: budget.id,
      amount: 0,
      periodNo: budget.periodNo,
      periodStartDate: periodStartDate,
      periodEndDate: periodEndDate,
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
    budgetReports.items = budgetReports.items.map((r: any) => {
      r.transactions = r.transactions.map((t: any) => t.transaction);
      return r;
    });
    return budgetReports;
  }
}
