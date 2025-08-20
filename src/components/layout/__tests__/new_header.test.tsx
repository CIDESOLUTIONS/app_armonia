import { render, screen } from "@/__mocks__/test-utils";
import { Header } from "../header";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import i18n from 'i18next'; // Import i18n

// Initialize a basic i18n instance for tests
i18n.init({
  lng: 'es',
  fallbackLng: 'es',
  resources: {
    es: {
      translation: {
        "header.title": "Armonía", // Provide a translation for the title
        "header.toggleLanguage": "toggleLanguage", // Provide translation for the button title
      },
    },
  },
});

// Mock de zustand store
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock de react-i18next a nivel de archivo
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key), // Use the initialized i18n instance
    i18n: {
      changeLanguage: vi.fn((lng) => {
        const router = useRouter();
        router.replace("/", { locale: lng });
      }),
      language: 'es',
    },
  }),
  I18nextProvider: ({ children }) => children, // Mock the provider to just render children
}));

describe("Header Component - New Test", () => {
  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    (useAuthStore as any).mockReturnValue({
      user: null,
      changeUserRole: vi.fn(),
    });
  });

  it("renders the Armonía title", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>
    );
    expect(screen.getByText("Armonía")).toBeInTheDocument();
  });

  it("changes language when language button is clicked", async () => {
    const router = useRouter(); // Get the mocked router instance

    render(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>
    );
    const languageButton = screen.getByTitle("toggleLanguage");
    await userEvent.click(languageButton);
    expect(router.replace).toHaveBeenCalledWith("/", { locale: "en" });
  });
});