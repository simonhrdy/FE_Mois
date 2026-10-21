import type { ComplaintTopic } from '@/features/insights/types/insight.types';

export const TOPIC_RULES: Record<ComplaintTopic, { pattern: RegExp; keyword: string }> = {
  temperature: { pattern: /\bcold\b|lukewarm/i, keyword: 'cold' },
  delivery: { pattern: /deliver|order was wrong/i, keyword: 'delivery' },
  waiting: { pattern: /waited|slow|took over|nobody checked/i, keyword: 'wait' },
  staff: { pattern: /rude|staff|cashier|server/i, keyword: 'staff' },
  quality: {
    pattern: /soggy|undercooked|overcooked|cheap|bland|dry|stale|sparse/i,
    keyword: 'undercooked',
  },
  cleanliness: { pattern: /dirty|mess|restroom/i, keyword: 'dirty' },
  price: { pattern: /price|money|expensive/i, keyword: 'money' },
  management: { pattern: /management/i, keyword: 'management' },
};
