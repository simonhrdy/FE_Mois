import Image from 'next/image';
import NextLink from 'next/link';

import { APP_NAME } from '@/lib/config/app';
import BrandLogo from '../../public/images/brand-logo.png';
import BrandLogoSmall from '../../public/images/brand-logo-small.png';

interface AppLogoProps {
  href: string;
  compact?: boolean;
}

export function AppLogo({ href, compact = false }: AppLogoProps) {
  const size = compact ? 24 : 120;

  const logo = compact ? BrandLogoSmall : BrandLogo;

  return (
    <NextLink
      href={href}
      aria-label={`${APP_NAME} – úvod`}
      className="inline-flex w-fit items-center rounded-md no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <Image
        src={logo}
        alt={APP_NAME}
        width={size}
        height={size}
        priority
        className="h-auto w-auto shrink-0 object-contain"
      />
    </NextLink>
  );
}
