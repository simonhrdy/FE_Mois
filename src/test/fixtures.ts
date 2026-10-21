import type { BusinessStats } from '@/features/analytics/types/stats.types';
import type { Business } from '@/features/businesses/types/business.types';

export function businessFixture(overrides: Partial<Business> = {}): Business {
  return {
    id: 'bella',
    name: 'Bella Pizza',
    address: '1 Strip',
    city: 'Las Vegas',
    state: 'NV',
    postalCode: '89109',
    latitude: 36.1,
    longitude: -115.1,
    stars: 3.9,
    reviewCount: 100,
    isOpen: true,
    categories: ['Pizza'],
    ...overrides,
  };
}

export function statsFixture(overrides: Partial<BusinessStats> = {}): BusinessStats {
  return {
    businessId: 'bella',
    from: '2025-10-09',
    to: '2026-10-09',
    averageRating: 4,
    reviewCount: 10,
    negativeCount: 2,
    distribution: [1, 1, 2, 3, 3],
    monthly: [],
    ...overrides,
  };
}
