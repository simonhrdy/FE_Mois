import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import type { Metadata, Viewport } from 'next';
import { Roboto_Flex } from 'next/font/google';

import { AppProviders } from '@/components/providers/AppProviders';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/config/app';

import './globals.css';

const robotoFlex = Roboto_Flex({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-roboto-flex',
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F9FA' },
    { media: '(prefers-color-scheme: dark)', color: '#161819' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="cs" className={robotoFlex.variable} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          attribute="class"
          defaultMode="light"
          modeStorageKey="yelp-color-mode"
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
