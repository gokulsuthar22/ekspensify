import { TxType } from '@prisma/client';

export interface GenerateCategorySlug {
  name: string;
  type?: string;
  userId?: number;
}

export interface CreateCategoryData {
  name: string;
  type?: TxType;
  icon?: string;
  userId?: number;
}

export interface CategoryWhere {
  id: number;
  userId: number;
}

export interface UpdateCategoryData {
  name?: string;
  type?: TxType;
  icon?: string;
}

export interface FilterCategoryWhere {
  slug?: string;
  type?: TxType;
  userId?: number;
  isActive?: boolean;
  OR?: any;
}
