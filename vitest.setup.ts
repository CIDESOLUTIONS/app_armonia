import "reflect-metadata";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import "text-encoding";
import { vi } from "vitest";

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// Mock de next/navigation (global y controlable)
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}));

// Mock de i18next
vi.mock("i18next", () => {
  const i18nInstance = {
    init: vi.fn(),
    use: vi.fn(() => i18nInstance), // Return the instance itself for chaining
    t: vi.fn((key) => key),
    changeLanguage: vi.fn(),
    language: 'es',
  };
  return {
    default: i18nInstance, // Default export is the i18n instance
    i18n: i18nInstance, // Named export for i18n
  };
});

// Mock de react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key) => key),
    i18n: {
      changeLanguage: vi.fn(),
      language: 'es',
    },
  })),
  I18nextProvider: ({ children }) => children,
}));