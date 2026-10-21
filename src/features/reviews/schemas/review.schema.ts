import { z } from 'zod';

import { DEFAULT_PAGE_SIZE } from '@/lib/config/app';

export const MIN_STARS = 1;
export const MAX_STARS = 5;

export const NEGATIVE_MAX_STARS = 2;

export const REVIEW_SORTS = ['newest', 'oldest', 'lowest', 'highest', 'useful'] as const;

export const starsSchema = z.number().int().min(MIN_STARS).max(MAX_STARS);

export const reviewSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().min(1),
  userName: z.string(),
  stars: starsSchema,
  text: z.string(),
  date: z.iso.datetime({ offset: true }),
  useful: z.number().int().nonnegative(),
  funny: z.number().int().nonnegative(),
  cool: z.number().int().nonnegative(),
});

const isoDay = z.iso.date();

export const reviewQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().catch(1),
    pageSize: z.coerce.number().int().positive().catch(DEFAULT_PAGE_SIZE),
    minStars: z.coerce.number().pipe(starsSchema).catch(MIN_STARS),
    maxStars: z.coerce.number().pipe(starsSchema).catch(MAX_STARS),
    from: isoDay.optional().catch(undefined),
    to: isoDay.optional().catch(undefined),
    search: z.string().trim().catch(''),
    sort: z.enum(REVIEW_SORTS).catch('newest'),
  })
  .transform((query) =>
    query.minStars > query.maxStars
      ? { ...query, minStars: query.maxStars, maxStars: query.minStars }
      : query,
  );
