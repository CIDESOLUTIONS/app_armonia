import { render, screen } from "@/__mocks__/test-utils";
import { Header } from "../header";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Mock de zustand store
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
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
    render(<Header />);
    expect(screen.getByText("Armonía")).toBeInTheDocument();
  });

  it("changes language when language button is clicked", async () => {
    const router = useRouter(); // Get the mocked router instance
    const { i18n } = useTranslation(); // Get the mocked i18n instance

    render(<Header />);
    const languageButton = screen.getByTitle("toggleLanguage");
    await userEvent.click(languageButton);
    expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
    expect(router.replace).toHaveBeenCalledWith("/", { locale: "en" });
  });
});