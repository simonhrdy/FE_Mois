import { z } from 'zod';

import type { ApiErrorBody, ApiResponse, PaginatedResponse } from '@/types/api';

export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export function apiResponseSchema<T>(item: z.ZodType<T>): z.ZodType<ApiResponse<T>> {
  return z.object({ data: item });
}

export function paginatedResponseSchema<T>(item: z.ZodType<T>): z.ZodType<PaginatedResponse<T>> {
  return z.object({ data: z.array(item), meta: paginationMetaSchema });
}

export const apiErrorBodySchema: z.ZodType<ApiErrorBody> = z.object({
  message: z.string().optional(),
  code: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});
