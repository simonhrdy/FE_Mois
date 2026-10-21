import { analyticsService } from '@/features/analytics/services/analytics.service';
import { competitorService } from '@/features/competitors/services/competitor.service';
import { insightService } from '@/features/insights/services/insight.service';
import { reviewService } from '@/features/reviews/services/review.service';
import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/config/env';

import { createAssistantExecutor } from '../services/assistant-executor';

import { createHttpAssistantRepository } from './http-assistant.repository';
import { createMockAssistantRepository } from './mock-assistant.repository';

export type { AssistantRepository } from './assistant.repository';

export const assistantRepository = env.apiMocking
  ? createMockAssistantRepository(
      createAssistantExecutor({
        reviews: reviewService,
        competitors: competitorService,
        analytics: analyticsService,
        insights: insightService,
      }),
    )
  : createHttpAssistantRepository(apiClient);
