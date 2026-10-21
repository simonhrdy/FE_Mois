import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import BookmarksOutlined from '@mui/icons-material/BookmarksOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import SpaceDashboardOutlined from '@mui/icons-material/SpaceDashboardOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import type SvgIcon from '@mui/material/SvgIcon';

import { routes } from '@/lib/config/routes';

export interface NavItem {
  label: string;
  href: string;
  icon: typeof SvgIcon;

  description: string;

  exact?: boolean;
}

export interface NavGroup {
  title: string;
  items: readonly NavItem[];
}

export const navGroups: readonly NavGroup[] = [
  {
    title: 'Reputace',
    items: [
      {
        label: 'Přehled',
        href: routes.dashboard,
        icon: SpaceDashboardOutlined,
        description: 'Skóre, KPI a doporučení',
      },
      {
        label: 'Recenze',
        href: routes.reviews,
        icon: RateReviewOutlined,
        description: 'Procházet a filtrovat recenze',
      },
      {
        label: 'Analytika',
        href: routes.analytics,
        icon: InsightsOutlined,
        description: 'Vývoj hodnocení v čase',
      },
    ],
  },
  {
    title: 'Konkurence',
    items: [
      {
        label: 'Najít konkurenci',
        href: routes.competitors,
        icon: StorefrontOutlined,
        description: 'Podniky ve stejné kategorii a lokalitě',
        exact: true,
      },
      {
        label: 'Moje konkurence',
        href: routes.watchedCompetitors,
        icon: BookmarksOutlined,
        description: 'Srovnání se sledovanými podniky',
      },
    ],
  },
  {
    title: 'Nástroje',
    items: [
      {
        label: 'AI asistent',
        href: routes.assistant,
        icon: ChatBubbleOutlineRounded,
        description: 'Zeptejte se běžnou řečí',
      },
      {
        label: 'Nastavení',
        href: routes.settings,
        icon: SettingsOutlined,
        description: 'Vzhled a připojení',
      },
    ],
  },
];

export const allNavItems: readonly NavItem[] = navGroups.flatMap((group) => group.items);

export function isNavItemActive(pathname: string, { href, exact }: NavItem): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
