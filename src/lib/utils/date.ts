const MS_PER_DAY = 86_400_000;

export function toIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

export function addUtcMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

export function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function startOfUtcMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function monthKeysBetween(fromDay: string, toDay: string): string[] {
  const keys: string[] = [];
  const end = toMonthKey(new Date(toDay));
  for (let cursor = startOfUtcMonth(new Date(fromDay)); ; cursor = addUtcMonths(cursor, 1)) {
    const key = toMonthKey(cursor);
    keys.push(key);
    if (key >= end) return keys;
  }
}

export function lastMonthsRange(months: number, now: Date = new Date()) {
  return { from: toIsoDay(addUtcMonths(now, -months)), to: toIsoDay(now) };
}

export function previousRange(range: { from: string; to: string }) {
  const from = new Date(range.from);
  const lengthDays = Math.round((new Date(range.to).getTime() - from.getTime()) / MS_PER_DAY);
  return { from: toIsoDay(addUtcDays(from, -lengthDays - 1)), to: toIsoDay(addUtcDays(from, -1)) };
}

export function lastDaysRange(days: number, now: Date = new Date()) {
  return { from: toIsoDay(addUtcDays(now, -days)), to: toIsoDay(now) };
}
