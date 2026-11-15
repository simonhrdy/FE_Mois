export const brand = {
  primary: { light: '#123356', dark: '#85B7EB' },
  secondary: { light: '#147D7C', dark: '#3BB9B8' },
  tertiary: { light: '#526A80', dark: '#A5BBD0' },
} as const;

export const surfaces = {
  light: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    container: '#F1F3F4',
    containerHigh: '#E9ECEF',
    outline: 'rgba(24, 28, 32, 0.10)',
  },
  dark: {
    default: '#161819',
    paper: '#202325',
    container: '#292D30',
    containerHigh: '#33383C',
    outline: 'rgba(255, 255, 255, 0.10)',
  },
} as const;

export const text = {
  light: { primary: '#232629', secondary: '#62696F' },
  dark: { primary: '#F2F4F5', secondary: '#AFB7BD' },
} as const;
