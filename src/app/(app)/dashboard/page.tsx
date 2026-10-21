import type { Metadata } from 'next';

import { DashboardPage } from '@/app/(app)/_modules';

export const metadata: Metadata = { title: 'Přehled' };

export default function Page() {
  return <DashboardPage />;
}
