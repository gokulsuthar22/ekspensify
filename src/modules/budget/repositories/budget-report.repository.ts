import { PaginationService } from '@/common/services/pagination.service';
import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BudgetReport } from '@prisma/client';

@Injectable()
export class BudgetReportRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private get BudgetReport() {
    return this.prismaService.budgetReport;
  }

  async create(data: any) {
    const report = await this.BudgetReport.create({ data });
    return report;
  }

  async update(id: number, data?: any) {
    const report = await this.BudgetReport.update({ where: { id }, data });
    return report;
  }

  async findMany(where?: any) {
    const reports = await this.paginationService.paginate<BudgetReport>(
      this.BudgetReport,
      { where, orderBy: { createdAt: 'desc' } },
    );
    return reports;
  }

  async calTotalReportAmount(budgetId: number) {
    const { _sum } = await this.BudgetReport.aggregate({
      _sum: { amount: true },
      where: {
        budgetId,
      },
    });
    return +_sum.amount || 0;
  }
}
