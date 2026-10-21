import { z } from 'zod';

export const businessSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),

  stars: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  isOpen: z.boolean(),
  categories: z.array(z.string()),
});

export const businessSummarySchema = businessSchema.pick({ id: true, name: true, city: true });
