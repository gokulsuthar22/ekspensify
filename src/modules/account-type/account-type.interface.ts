import { AccountCategory } from '@prisma/client';

export interface CreateAccountTypeData {
  name: string;
  category: AccountCategory;
}

export interface UpdateAccountTypeData {
  name?: string;
  category?: AccountCategory;
}

export interface FilterAccountTypeWhere {
  slug?: string;
  category?: AccountCategory;
}
