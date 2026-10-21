import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surfaceContainer: string;
    surfaceContainerHigh: string;
    outlineVariant: string;
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    outlineVariant?: string;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}
