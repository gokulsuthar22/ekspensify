export interface CreateAccountData {
  userId: string;
  accountTypeId: string;
  balance: number;
}

export interface UpdateAccountData {
  accountTypeId?: string;
  balance?: number;
}

export interface AccountWhere {
  id: string;
  userId: string;
}

export interface FilterAccountWhere {
  userId?: string;
}
