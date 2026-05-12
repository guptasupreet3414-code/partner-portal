import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  initialPath?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { initialPath = '/', ...options }: Options = {}
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter initialEntries={[initialPath]}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </MemoryRouter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}
