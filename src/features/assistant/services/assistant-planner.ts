import type { ToolCall } from '../types/assistant.types';

export const DEFAULT_COMPETITOR_COUNT = 3;
export const DEFAULT_REVIEW_LIMIT = 5;
export const DEFAULT_TREND_MONTHS = 12;
export const DEFAULT_TOPIC_DAYS = 90;
const MAX_COMPETITORS = 10;

const NUMBER_WORDS: Record<string, number> = {
  dva: 2,
  dve: 2,
  dvema: 2,
  dvou: 2,
  tri: 3,
  tremi: 3,
  trech: 3,
  ctyri: 4,
  ctyrmi: 4,
  ctyrech: 4,
  pet: 5,
  peti: 5,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

const INTENTS = {
  negative: /negativ|spatn|kritick|stiznost|nespokoj|1[-–]2|negative|bad review|complain/,
  comparison: /porovn|srovn|konkurenc|nejlep|compare|competitor|best/,
  trend: /vyvoj|vyvij|trend|analyt|klesa|roste|v case|over time|declin/,
  topics: /vadi|stezuj|stiznost|temat|problem|duvod|proc |complain|topic|why/,
};

export function normalizePrompt(prompt: string): string {
  return prompt
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function parseCount(text: string): number | undefined {
  const digits = /\b(\d{1,2})\s*(?:nejlep|best|top|konkurent|pizz|podnik|restaura)/.exec(text);
  if (digits?.[1]) return Number(digits[1]);
  for (const word of text.split(/\W+/)) {
    const value = NUMBER_WORDS[word];
    if (value !== undefined) return value;
  }
  return undefined;
}

function parsePeriodDays(text: string): number | undefined {
  const match = /(\d{1,3})\s*(dn|den|day|mesic|month)/.exec(text);
  if (!match?.[1] || !match[2]) return undefined;
  const value = Number(match[1]);
  return match[2].startsWith('mesic') || match[2].startsWith('month') ? value * 30 : value;
}

export function planAssistantQuery(prompt: string): ToolCall[] {
  const text = normalizePrompt(prompt);
  const plan: ToolCall[] = [];
  const periodDays = parsePeriodDays(text);

  if (INTENTS.topics.test(text)) {
    plan.push({
      name: 'analyze_topics',
      arguments: { periodDays: periodDays ?? DEFAULT_TOPIC_DAYS },
    });
  }
  if (INTENTS.negative.test(text) && !INTENTS.topics.test(text)) {
    plan.push({
      name: 'search_reviews',
      arguments: {
        maxStars: 2,
        limit: DEFAULT_REVIEW_LIMIT,
        ...(periodDays ? { periodDays } : {}),
      },
    });
  }
  if (INTENTS.comparison.test(text)) {
    const count = Math.min(parseCount(text) ?? DEFAULT_COMPETITOR_COUNT, MAX_COMPETITORS);
    plan.push({ name: 'find_competitors', arguments: { sort: 'rating', limit: count } });
    plan.push({ name: 'compare_businesses', arguments: { months: DEFAULT_TREND_MONTHS } });
  }
  if (INTENTS.trend.test(text)) {
    plan.push({ name: 'get_rating_trend', arguments: { months: DEFAULT_TREND_MONTHS } });
  }
  return plan;
}
