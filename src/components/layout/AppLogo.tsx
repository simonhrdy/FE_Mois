import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { APP_NAME } from '@/lib/config/app';

interface AppLogoProps {
  href: string;
  compact?: boolean;
}

export function AppLogo({ href, compact = false }: AppLogoProps) {
  return (
    <NextLink
      href={href}
      aria-label={`${APP_NAME} – úvod`}
      className="inline-flex w-fit items-center rounded-md no-underline"
    >
      <Typography
        component="span"
        color="primary"
        sx={{
          fontSize: compact ? 23 : 36,
          fontWeight: 850,
          letterSpacing: '-0.065em',
          lineHeight: 1.15,
        }}
      >
        {APP_NAME}
      </Typography>
    </NextLink>
  );
}
