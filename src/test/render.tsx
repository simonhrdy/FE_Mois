import { ThemeProvider } from '@mui/material/styles';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from '@/store';
import { theme } from '@/theme/theme';

interface ProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore;
}

export function renderWithProviders(
  ui: ReactElement,
  { store = makeStore(), ...options }: ProviderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
