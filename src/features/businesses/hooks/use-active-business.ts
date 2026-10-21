'use client';

import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/auth.slice';
import { selectActiveBusinessId } from '@/store/slices/workspace.slice';

export function useActiveBusiness() {
  const businessId = useAppSelector(selectActiveBusinessId);
  const user = useAppSelector(selectCurrentUser);
  const summary = user?.businesses.find((business) => business.id === businessId) ?? null;
  return { businessId, summary, businesses: user?.businesses ?? [] };
}
