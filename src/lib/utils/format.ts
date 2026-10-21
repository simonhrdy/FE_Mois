const LOCALE = 'cs-CZ';

const DATE_FORMATTER = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: 'UTC' });
const PERCENT_FORMATTER = new Intl.NumberFormat(LOCALE, { style: 'percent' });
const RATING_FORMATTER = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const DELTA_FORMATTER = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});
const INTEGER_FORMATTER = new Intl.NumberFormat(LOCALE);
const SIGNED_INTEGER_FORMATTER = new Intl.NumberFormat(LOCALE, { signDisplay: 'exceptZero' });

const NOT_AVAILABLE = '—';

export function formatDate(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(isoDate));
}

export function formatMonth(period: string): string {
  const [year = '', month = ''] = period.split('-');
  return `${Number(month)}/${year.slice(-2)}`;
}

export function formatPercent(ratio: number): string {
  return PERCENT_FORMATTER.format(ratio);
}

export function formatRating(rating: number | null): string {
  return rating === null ? NOT_AVAILABLE : RATING_FORMATTER.format(rating);
}

export function formatRatingDelta(delta: number | null): string {
  return delta === null ? NOT_AVAILABLE : DELTA_FORMATTER.format(delta);
}

export function formatNumber(value: number): string {
  return INTEGER_FORMATTER.format(value);
}

export function formatSignedNumber(value: number): string {
  return SIGNED_INTEGER_FORMATTER.format(value);
}
