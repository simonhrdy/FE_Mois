import SearchOff from '@mui/icons-material/SearchOff';

import { LinkButton } from '@/components/navigation/LinkButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { routes } from '@/lib/config/routes';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <EmptyState
        icon={<SearchOff />}
        title="Stránka nenalezena"
        description="Hledaná stránka neexistuje nebo byla přesunuta."
        action={
          <LinkButton href={routes.dashboard} variant="contained">
            Přejít na přehled
          </LinkButton>
        }
      />
    </main>
  );
}
