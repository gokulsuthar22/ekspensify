import { TxType } from '@prisma/client';

export interface CreateTransactionData {
  userId: number;
  accountId: number;
  categoryId: number;
  amount: number;
  note: string;
  type: TxType;
}

export interface TransactionWhere {
  id: number;
  userId: number;
}

export interface UpdateTransactionData {
  accountId?: number;
  categoryId?: number;
  note?: string;
  amount?: number;
  type?: TxType;
}

export interface FilterTransactionWhere {
  userId?: number;
  accountId?: number;
  categoryId?: number;
  note?: string;
  amount?: number;
  type?: TxType;
}
