export interface ApiResponse<T> {
  data: T;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ApiErrorBody {
  message?: string;
  code?: string;

  errors?: Record<string, string[]>;
}
