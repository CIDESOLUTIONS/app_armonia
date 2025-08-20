import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { vi } from 'vitest';
import { ToastProvider } from '@/components/ui/use-toast';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

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


// Mock the router
const createMockRouter = () => ({
  back: vi.fn(),
  forward: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
        <AppRouterContext.Provider value={createMockRouter() as any}>
            <ToastProvider>
                <SessionProvider>{children}</SessionProvider> {/* Add SessionProvider */}
            </ToastProvider>
        </AppRouterContext.Provider>
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
