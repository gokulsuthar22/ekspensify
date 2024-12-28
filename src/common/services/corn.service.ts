import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class CronService {
  constructor(private prismaService: PrismaService) {}

  private readonly logger = new Logger(CronService.name);

  @Cron('0 0 0 * * *')
  async processBudgets() {
    this.logger.debug(
      `Daily budget processing started at ${new Date().toISOString()}`,
    );

    const currentDate = moment().utc();

    const isWeekend = currentDate.isoWeekday() === 7;
    const isMonthEnd = currentDate.isSame(
      currentDate.clone().endOf('month'),
      'day',
    );
    const isQuarterEnd = currentDate.isSame(
      currentDate.clone().endOf('quarter'),
      'day',
    );
    const isYearEnd = currentDate.isSame(
      currentDate.clone().endOf('year'),
      'day',
    );

    const recurringBudgets = await this.prismaService.budget.findMany({
      where: { type: 'RECURRING' },
    });

    this.logger.debug(`${recurringBudgets.length} recurring budgets found`);

    const budgetIdsToUpdate: number[] = [];

    // Identify budgets to update based on their recurrence period
    for (const budget of recurringBudgets) {
      const shouldUpdate = this.shouldUpdateBudget(
        budget.period,
        isWeekend,
        isMonthEnd,
        isQuarterEnd,
        isYearEnd,
      );

      if (shouldUpdate) {
        budgetIdsToUpdate.push(budget.id);

        // Generate new budget reports and update budgets with the new reports
        const { periodStartDate, periodEndDate } = this.calculatePeriodDates(
          budget.period,
          currentDate,
        );

        const budgetReports = await this.prismaService.budgetReport.create({
          data: {
            budgetId: budget.id,
            amount: 0,
            periodNo: budget.periodNo + 1,
            periodStartDate,
            periodEndDate,
          },
        });

        // this.logger.debug(`${budgetReports.length} budget reports created`);

        await this.updateBudgetsWithReports(budgetReports);
      }
    }

    // Increment periodNo for applicable budgets
    if (budgetIdsToUpdate.length > 0) {
      await this.prismaService.budget.updateMany({
        where: { id: { in: budgetIdsToUpdate } },
        data: { periodNo: { increment: 1 } },
      });

      this.logger.debug(`${budgetIdsToUpdate.length} budgets updated`);
    }

    this.logger.debug(
      `Daily budget processing finished at ${new Date().toISOString()}`,
    );
  }

  private shouldUpdateBudget(
    period: string,
    isWeekend: boolean,
    isMonthEnd: boolean,
    isQuarterEnd: boolean,
    isYearEnd: boolean,
  ): boolean {
    switch (period) {
      case 'DAILY':
        return true;
      case 'WEEKLY':
        return isWeekend;
      case 'MONTHLY':
        return isMonthEnd;
      case 'QUARTERLY':
        return isQuarterEnd;
      case 'YEARLY':
        return isYearEnd;
      default:
        this.logger.error(`Unknown budget period: ${period}`);
        return false;
    }
  }

  private calculatePeriodDates(
    period: string,
    currentDate: moment.Moment,
  ): { periodStartDate: Date; periodEndDate: Date } {
    const periodUnit = period
      .toLowerCase()
      .replace('ly', '') as moment.unitOfTime.DurationConstructor;
    const periodStartDate = currentDate.toDate();
    const periodEndDate = currentDate.clone().add(1, periodUnit).toDate();

    return { periodStartDate, periodEndDate };
  }

  private async updateBudgetsWithReports(report: any) {
    await this.prismaService.budget.update({
      where: { id: report.budgetId },
      data: { reportId: report.id, spent: 0 },
    });
  }
}
