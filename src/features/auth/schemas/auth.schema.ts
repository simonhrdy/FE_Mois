import { z } from 'zod';

import { businessSummarySchema } from '@/features/businesses/schemas/business.schema';

export const PASSWORD_MIN = 8;

export const loginSchema = z.object({
  email: z.email({ error: 'Zadejte platný e-mail' }),
  password: z.string().min(PASSWORD_MIN, { error: `Heslo musí mít alespoň ${PASSWORD_MIN} znaků` }),
});

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  businesses: z.array(businessSummarySchema),
});

export const sessionSchema = z.object({
  token: z.string().min(1),
  user: authUserSchema,
});
