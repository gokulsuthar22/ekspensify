export type PaginatedResult<T> = {
  limit: number;
  next: number;
  offset: number;
  prev: number;
  total: number;
  items: T[];
};
