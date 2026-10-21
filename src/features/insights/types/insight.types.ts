import type { z } from 'zod';

import type { COMPLAINT_TOPICS, topicInsightSchema } from '../schemas/insight.schema';

export type ComplaintTopic = (typeof COMPLAINT_TOPICS)[number];
export type TopicInsight = z.infer<typeof topicInsightSchema>;

export type ReputationLevel = 'excellent' | 'good' | 'risk' | 'critical';

export interface ScoreFactor {
  id: 'rating' | 'negative' | 'momentum' | 'benchmark';
  label: string;

  value: number;
  weight: number;
}

export interface ReputationScore {
  score: number;
  level: ReputationLevel;
  factors: ScoreFactor[];
}
