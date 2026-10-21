import { AppShell } from '@/components/layout/AppShell';
import { AuthGate } from '@/features/auth/components/AuthGate';

export default function ApplicationLayout({ children }: LayoutProps<'/'>) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
