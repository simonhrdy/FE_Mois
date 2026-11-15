import { alpha, createTheme } from '@mui/material/styles';

import { brand, surfaces, text } from './colors';
import { typography } from './typography';

const RADIUS = 12;
const CARD_RADIUS = 12;
const PILL_RADIUS = 999;

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: brand.primary.light },
        secondary: { main: brand.secondary.light },
        tertiary: { main: brand.tertiary.light, contrastText: '#FFFFFF' },
        background: { default: surfaces.light.default, paper: surfaces.light.paper },
        text: text.light,
        divider: surfaces.light.outline,
        surfaceContainer: surfaces.light.container,
        surfaceContainerHigh: surfaces.light.containerHigh,
        outlineVariant: surfaces.light.outline,
      },
    },
    dark: {
      palette: {
        primary: { main: brand.primary.dark },
        secondary: { main: brand.secondary.dark },
        tertiary: { main: brand.tertiary.dark, contrastText: '#0B1E2E' },
        background: { default: surfaces.dark.default, paper: surfaces.dark.paper },
        text: text.dark,
        divider: surfaces.dark.outline,
        surfaceContainer: surfaces.dark.container,
        surfaceContainerHigh: surfaces.dark.containerHigh,
        outlineVariant: surfaces.dark.outline,
      },
    },
  },
  typography,
  shape: { borderRadius: RADIUS },
  focusVisible: true,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 18 },
        sizeSmall: { paddingInline: 12 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: CARD_RADIUS,
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { padding: '20px 24px 8px' },
        title: ({ theme }) => ({ ...theme.typography.h6 }),
        subheader: ({ theme }) => ({ ...theme.typography.body2 }),
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: '16px 24px', '&:last-child': { paddingBottom: 24 } } },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: RADIUS + 4 } } },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: RADIUS } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } } },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 16, alignItems: 'center' } },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: PILL_RADIUS,
          padding: 3,
          gap: 2,
          backgroundColor: theme.vars.palette.surfaceContainer,
        }),
        grouped: {
          border: 0,
          borderRadius: `${PILL_RADIUS}px !important`,
          paddingInline: 14,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-selected': {
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.primary.main,
            boxShadow: '0 1px 3px rgba(20, 19, 43, 0.12)',
          },
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(brand.primary.light, 0.07),
            color: theme.vars.palette.primary.main,
            fontWeight: 600,
            '&:hover': { backgroundColor: alpha(brand.primary.light, 0.11) },
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
        head: ({ theme }) => ({
          ...theme.typography.caption,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: theme.vars.palette.text.secondary,
          backgroundColor: theme.vars.palette.surfaceContainer,
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { borderRadius: 8, fontSize: '0.75rem', padding: '6px 10px' } },
    },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: PILL_RADIUS } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 28 } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: 16 } } },
  },
});
