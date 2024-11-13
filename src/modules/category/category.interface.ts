export interface CreateCategoryData {
  name: string;
  userId?: string;
}

export interface CategoryWhere {
  id: string;
  userId: string;
}

export interface UpdateCategoryData {
  name?: string;
}

export interface FilterCategoryWhere {
  slug?: string;
  userId?: string;
  isActive?: boolean;
  OR?: any;
}
