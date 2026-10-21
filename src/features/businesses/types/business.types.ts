import type { z } from 'zod';

import type { businessSchema, businessSummarySchema } from '../schemas/business.schema';

export type Business = z.infer<typeof businessSchema>;
export type BusinessSummary = z.infer<typeof businessSummarySchema>;
