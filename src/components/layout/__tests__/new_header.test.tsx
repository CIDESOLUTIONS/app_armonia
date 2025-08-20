import { render, screen } from "@/__mocks__/test-utils";
import { Header } from "../header";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock de zustand store
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock de react-i18next a nivel de archivo
vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();
  const { useRouter } = await vi.importActual("next/navigation");
  const router = useRouter();
  return {
    ...actual,
    useTranslation: () => ({
      ...actual.useTranslation(),
      i18n: {
        ...actual.useTranslation().i18n,
        changeLanguage: vi.fn((lng) => {
          router.replace("/", { locale: lng });
        }),
      },
    }),
  };
});

describe("Header Component - New Test", () => {
  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    (useAuthStore as any).mockReturnValue({
      user: null,
      changeUserRole: vi.fn(),
    });
  });

  it("renders the Armonía title", () => {
    render(<Header />);
    expect(screen.getByText("Armonía")).toBeInTheDocument();
  });

  it("changes language when language button is clicked", async () => {
    const router = useRouter();

    render(<Header />);
    const languageButton = screen.getByTitle("toggleLanguage");
    await userEvent.click(languageButton);
    expect(router.replace).toHaveBeenCalledWith("/", { locale: "en" });
  });
});