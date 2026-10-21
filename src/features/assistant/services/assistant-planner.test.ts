import { describe, expect, it } from 'vitest';

import { normalizePrompt, planAssistantQuery } from './assistant-planner';

describe('planAssistantQuery', () => {
  it('plans the example query from the specification', () => {
    const plan = planAssistantQuery(
      'Ukaž mi negativní recenze mé restaurace a porovnej moje hodnocení se třemi nejlépe hodnocenými pizzeriemi v okolí.',
    );

    expect(plan).toEqual([
      { name: 'search_reviews', arguments: { maxStars: 2, limit: 5 } },
      { name: 'find_competitors', arguments: { sort: 'rating', limit: 3 } },
      { name: 'compare_businesses', arguments: { months: 12 } },
    ]);
  });

  it('understands numbers written as digits or Czech words', () => {
    expect(planAssistantQuery('Porovnej mě s pěti nejlepšími konkurenty')[0]).toMatchObject({
      arguments: { limit: 5 },
    });
    expect(planAssistantQuery('compare me with 4 best competitors')[0]).toMatchObject({
      arguments: { limit: 4 },
    });
  });

  it('parses a time period for negative reviews', () => {
    expect(planAssistantQuery('Ukaž negativní recenze za posledních 30 dní')).toEqual([
      { name: 'search_reviews', arguments: { maxStars: 2, limit: 5, periodDays: 30 } },
    ]);
  });

  it('recognises a rating trend question', () => {
    expect(planAssistantQuery('Jak se vyvíjí moje hodnocení?')).toEqual([
      { name: 'get_rating_trend', arguments: { months: 12 } },
    ]);
  });

  it('analyses complaint topics for "what bothers customers" questions', () => {
    expect(planAssistantQuery('Co zákazníkům nejvíc vadí za posledních 30 dní?')).toEqual([
      { name: 'analyze_topics', arguments: { periodDays: 30 } },
    ]);
  });

  it('returns an empty plan for unrelated questions', () => {
    expect(planAssistantQuery('Jaké bude zítra počasí?')).toEqual([]);
  });
});

describe('normalizePrompt', () => {
  it('removes diacritics and lower-cases text', () => {
    expect(normalizePrompt('Ukaž NEGATIVNÍ')).toBe('ukaz negativni');
  });
});
