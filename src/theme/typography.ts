import type { ThemeOptions } from '@mui/material/styles';

const FONT_STACK = 'var(--font-roboto-flex), "Roboto", "Helvetica Neue", Arial, sans-serif';

export const typography: ThemeOptions['typography'] = {
  fontFamily: FONT_STACK,
  h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05 },
  h2: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 },
  h3: { fontSize: '2rem', fontWeight: 650, letterSpacing: '-0.025em', lineHeight: 1.15 },
  h4: { fontSize: '1.625rem', fontWeight: 650, letterSpacing: '-0.02em', lineHeight: 1.2 },
  h5: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' },
  h6: { fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.005em' },
  subtitle1: { fontWeight: 600 },
  subtitle2: { fontWeight: 600 },
  overline: { fontWeight: 600, letterSpacing: '0.12em' },
  button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.005em' },
};
