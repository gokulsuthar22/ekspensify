import { BudgetPeriod, BudgetType } from '@prisma/client';

export interface CreateBudgetData {
  limit: number;
  userId: number;
  accountId?: number;
  categoryId?: number;
  period: BudgetPeriod;
  type: BudgetType;
  startDate: string;
  endDate?: string;
}

export interface UpdateBudgetData {
  limit?: number;
  spent?: number;
  userId?: number;
  accountId?: number;
  categoryId?: number;
  period?: BudgetPeriod;
  type?: BudgetType;
  startDate?: string;
  endDate?: string;
}

export interface FilterBudgetWhere {
  userId?: number;
}

export interface BudgetWhere {
  id: number;
  userId: number;
}
