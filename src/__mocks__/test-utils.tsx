import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { ToastProvider } from '@/components/ui/use-toast';
import { I18nextProvider } from 'react-i18next'; // Re-added I18nextProvider import
import i18n from 'i18next'; // Re-added i18n import
import { SessionProvider } from 'next-auth/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'; // Import MemoryRouterProvider

// Initialize a basic i18n instance for tests
i18n.init({
  lng: 'es',
  fallbackLng: 'es',
  resources: {
    es: {
      translation: {},
    },
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}> {/* Re-added I18nextProvider */}
      <MemoryRouterProvider> {/* Use MemoryRouterProvider here */}
        <ToastProvider>
          <SessionProvider>{children}</SessionProvider>
        </ToastProvider>
      </MemoryRouterProvider>
    </I18nextProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };