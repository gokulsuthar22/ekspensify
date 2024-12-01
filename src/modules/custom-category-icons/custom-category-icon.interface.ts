export interface CreateCustomCategoryIconData {
  iconId: number;
}

export interface UpsertCustomCategoryIcon {
  iconId: number;
  isActive: boolean;
}

export interface CustomCategoryIconWhere {
  iconId: number;
  isActive: boolean;
}

export interface UpdateCustomCategoryIconData {
  isActive?: boolean;
}

export interface FilterCustomCategoryIconWhere {
  isActive?: boolean;
}
