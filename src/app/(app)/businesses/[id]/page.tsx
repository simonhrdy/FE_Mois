import type { Metadata } from 'next';

import { BusinessDetailView } from '@/features/businesses/components/BusinessDetailView';

export const metadata: Metadata = { title: 'Detail podniku' };

export default async function BusinessPage({ params }: PageProps<'/businesses/[id]'>) {
  const { id } = await params;

  return <BusinessDetailView businessId={id} />;
}
