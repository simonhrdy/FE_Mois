import type { Business } from '@/features/businesses/types/business.types';
import type { Review } from '@/features/reviews/types/review.types';
import { addUtcMonths, startOfUtcMonth } from '@/lib/utils/date';

import { createRandom, hashSeed, randomInt, randomNormal, type Random } from './random';
import { generateReviewText, generateUserName } from './review-texts';

export const HISTORY_MONTHS = 24;
const STAR_DEVIATION = 0.95;

interface BusinessSeed extends Omit<Business, 'stars' | 'reviewCount'> {
  reviewsPerMonth: (monthsAgo: number) => number;
  targetRating: (monthsAgo: number) => number;
}

const LAS_VEGAS = { city: 'Las Vegas', state: 'NV' } as const;
const PIZZA = ['Pizza', 'Italian', 'Restaurants'];

const stable = (value: number) => () => value;

const BUSINESS_SEEDS: readonly BusinessSeed[] = [
  {
    id: 'bella-pizza-lv',
    name: 'Bella Pizza',
    address: '3570 S Las Vegas Blvd',
    postalCode: '89109',
    ...LAS_VEGAS,
    latitude: 36.1162,
    longitude: -115.1745,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: (monthsAgo) => (monthsAgo < 3 ? 30 : 16),
    targetRating: (monthsAgo) => (monthsAgo >= 7 ? 4.15 : 4.15 - (7 - monthsAgo) * 0.13),
  },
  {
    id: 'bella-pizza-summerlin',
    name: 'Bella Pizza Summerlin',
    address: '1980 Festival Plaza Dr',
    postalCode: '89135',
    ...LAS_VEGAS,
    latitude: 36.1517,
    longitude: -115.3326,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: stable(7),
    targetRating: (monthsAgo) => 3.9 + (HISTORY_MONTHS - monthsAgo) * 0.015,
  },
  {
    id: 'neon-crust-pizzeria',
    name: 'Neon Crust Pizzeria',
    address: '450 Fremont St',
    postalCode: '89101',
    ...LAS_VEGAS,
    latitude: 36.1707,
    longitude: -115.1428,
    isOpen: true,
    categories: ['Pizza', 'Bars', 'Restaurants'],
    reviewsPerMonth: stable(22),
    targetRating: stable(4.5),
  },
  {
    id: 'desert-oven-pizza',
    name: 'Desert Oven Pizza',
    address: '3200 Las Vegas Blvd S',
    postalCode: '89109',
    ...LAS_VEGAS,
    latitude: 36.1271,
    longitude: -115.1706,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: stable(14),
    targetRating: (monthsAgo) => 3.9 + (HISTORY_MONTHS - monthsAgo) * 0.02,
  },
  {
    id: 'strip-side-pizza',
    name: 'Strip Side Pizza Co.',
    address: '3708 S Las Vegas Blvd',
    postalCode: '89109',
    ...LAS_VEGAS,
    latitude: 36.1097,
    longitude: -115.1747,
    isOpen: true,
    categories: ['Pizza', 'Fast Food', 'Restaurants'],
    reviewsPerMonth: stable(30),
    targetRating: stable(3.6),
  },
  {
    id: 'golden-knight-pizza',
    name: 'Golden Knight Pizza',
    address: '6385 S Rainbow Blvd',
    postalCode: '89118',
    ...LAS_VEGAS,
    latitude: 36.0742,
    longitude: -115.2433,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: stable(9),
    targetRating: stable(4.3),
  },
  {
    id: 'lucky-7-pizzeria',
    name: 'Lucky 7 Pizzeria',
    address: '2500 E Tropicana Ave',
    postalCode: '89121',
    ...LAS_VEGAS,
    latitude: 36.1003,
    longitude: -115.1166,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: stable(11),
    targetRating: stable(3.9),
  },
  {
    id: 'red-rock-pizzeria',
    name: 'Red Rock Pizzeria',
    address: '11011 W Charleston Blvd',
    postalCode: '89135',
    ...LAS_VEGAS,
    latitude: 36.1576,
    longitude: -115.3297,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: stable(6),
    targetRating: stable(4.6),
  },
  {
    id: 'sin-city-slice',
    name: 'Sin City Slice',
    address: '255 E Flamingo Rd',
    postalCode: '89169',
    ...LAS_VEGAS,
    latitude: 36.1149,
    longitude: -115.1582,
    isOpen: false,
    categories: ['Pizza', 'Restaurants'],
    reviewsPerMonth: stable(8),
    targetRating: stable(3.2),
  },
  {
    id: 'trattoria-sole',
    name: 'Trattoria Sole',
    address: '3400 S Las Vegas Blvd',
    postalCode: '89109',
    ...LAS_VEGAS,
    latitude: 36.1215,
    longitude: -115.1702,
    isOpen: true,
    categories: ['Italian', 'Restaurants'],
    reviewsPerMonth: stable(12),
    targetRating: stable(4.4),
  },
  {
    id: 'vegas-burger-bar',
    name: 'Vegas Burger Bar',
    address: '3667 S Las Vegas Blvd',
    postalCode: '89109',
    ...LAS_VEGAS,
    latitude: 36.1125,
    longitude: -115.1712,
    isOpen: true,
    categories: ['Burgers', 'American', 'Restaurants'],
    reviewsPerMonth: stable(18),
    targetRating: stable(4.0),
  },
  {
    id: 'cactus-crust-phoenix',
    name: 'Cactus Crust Pizza',
    address: '401 N 1st St',
    postalCode: '85004',
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4521,
    longitude: -112.0715,
    isOpen: true,
    categories: PIZZA,
    reviewsPerMonth: stable(10),
    targetRating: stable(4.1),
  },
];

export const OWN_BUSINESS_IDS = ['bella-pizza-lv', 'bella-pizza-summerlin'] as const;

const ONE_STAR_SHARE = 0.45;

function sampleStars(random: Random, target: number): number {
  const stars = Math.min(5, Math.max(1, Math.round(randomNormal(random, target, STAR_DEVIATION))));
  return stars === 2 && random() < ONE_STAR_SHARE ? 1 : stars;
}

function sampleDate(random: Random, monthStart: Date, now: Date): Date {
  const monthEnd = Math.min(addUtcMonths(monthStart, 1).getTime(), now.getTime());
  return new Date(monthStart.getTime() + random() * (monthEnd - monthStart.getTime()));
}

function elapsedShareOfMonth(monthStart: Date, now: Date): number {
  const length = addUtcMonths(monthStart, 1).getTime() - monthStart.getTime();
  return Math.min(1, (now.getTime() - monthStart.getTime()) / length);
}

function generateReviews(seed: BusinessSeed, now: Date): Review[] {
  const random = createRandom(hashSeed(seed.id));
  const category = seed.categories[0] ?? 'Pizza';
  const reviews: Review[] = [];

  for (let monthsAgo = HISTORY_MONTHS - 1; monthsAgo >= 0; monthsAgo -= 1) {
    const monthStart = startOfUtcMonth(addUtcMonths(now, -monthsAgo));
    const expected = seed.reviewsPerMonth(monthsAgo) * elapsedShareOfMonth(monthStart, now);
    const count = Math.max(0, Math.round(expected) + randomInt(random, -3, 3));

    for (let index = 0; index < count; index += 1) {
      const stars = sampleStars(random, seed.targetRating(monthsAgo));
      reviews.push({
        id: `${seed.id}-r${reviews.length + 1}`,
        businessId: seed.id,
        userName: generateUserName(random),
        stars,
        text: generateReviewText(random, stars, category),
        date: sampleDate(random, monthStart, now).toISOString(),
        useful: randomInt(random, 0, 12),
        funny: randomInt(random, 0, 4),
        cool: randomInt(random, 0, 6),
      });
    }
  }
  return reviews;
}

export function averageStars(reviews: readonly Pick<Review, 'stars'>[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.stars, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export interface YelpDataset {
  businesses: Business[];
  reviews: Review[];
}

export function createYelpDataset(now: Date = new Date()): YelpDataset {
  const businesses: Business[] = [];
  const reviews: Review[] = [];

  for (const seed of BUSINESS_SEEDS) {
    const businessReviews = generateReviews(seed, now);
    const { reviewsPerMonth: _perMonth, targetRating: _target, ...business } = seed;
    businesses.push({
      ...business,
      stars: averageStars(businessReviews) ?? 0,
      reviewCount: businessReviews.length,
    });
    reviews.push(...businessReviews);
  }
  return { businesses, reviews };
}
