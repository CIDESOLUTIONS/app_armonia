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
