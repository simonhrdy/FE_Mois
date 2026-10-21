import { OWN_BUSINESS_IDS } from './yelp-dataset';

export const DEMO_ACCOUNT = {
  id: 'owner-1',
  name: 'Marco Rossi',
  email: 'majitel@bellapizza.test',
  password: 'BellaPizza2026',
  businessIds: OWN_BUSINESS_IDS,
} as const;
