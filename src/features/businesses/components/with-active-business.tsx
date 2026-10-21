'use client';

import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import type { ComponentType } from 'react';

import { EmptyState } from '@/components/ui/EmptyState';

import { useActiveBusiness } from '../hooks/use-active-business';

export function withActiveBusiness(View: ComponentType<{ businessId: string }>) {
  function ActiveBusinessView() {
    const { businessId } = useActiveBusiness();
    if (!businessId) {
      return (
        <EmptyState
          icon={<StorefrontOutlined />}
          title="Nemáte přiřazený žádný podnik"
          description="Požádejte administrátora o přiřazení podniku k vašemu účtu."
        />
      );
    }
    return <View key={businessId} businessId={businessId} />;
  }
  ActiveBusinessView.displayName = `withActiveBusiness(${View.displayName ?? View.name})`;
  return ActiveBusinessView;
}
