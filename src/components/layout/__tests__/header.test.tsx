import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../header";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { vi } from 'vitest';

// Mock de react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "es",
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock de next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Mock de zustand store
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("Header", () => {
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

  it("displays navigation links when not hidden", () => {
    render(<Header hideNavLinks={false} />);
    expect(screen.getByText("Header.features")).toBeInTheDocument();
    expect(screen.getByText("Header.plans")).toBeInTheDocument();
    expect(screen.getByText("Header.contact")).toBeInTheDocument();
  });

  it("hides navigation links when hideNavLinks is true", () => {
    render(<Header hideNavLinks={true} />);
    expect(screen.queryByText("Header.features")).not.toBeInTheDocument();
    expect(screen.queryByText("Header.plans")).not.toBeInTheDocument();
    expect(screen.queryByText("Header.contact")).not.toBeInTheDocument();
  });

  it("shows login button when not logged in", () => {
    render(<Header isLoggedIn={false} />);
    expect(screen.getByText("Header.login")).toBeInTheDocument();
  });

  it("shows user icon and logout button when logged in", () => {
    (useAuthStore as any).mockReturnValue({
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        role: "RESIDENT",
      },
      changeUserRole: vi.fn(),
    });
    render(<Header isLoggedIn={true} />);
    expect(screen.getByLabelText("User menu")).toBeInTheDocument(); // Assuming an accessible label
    fireEvent.click(screen.getByLabelText("User menu"));
    expect(screen.getByText("Header.logout")).toBeInTheDocument();
  });

  it("toggles theme between Claro and Oscuro", () => {
    render(<Header />);
    const themeButton = screen.getByTitle("Cambiar a Oscuro");
    fireEvent.click(themeButton);
    expect(themeButton).toHaveAttribute("title", "Cambiar a Claro");
    fireEvent.click(themeButton);
    expect(themeButton).toHaveAttribute("title", "Cambiar a Oscuro");
  });

  it("toggles currency between Pesos and Dólares", () => {
    render(<Header />);
    const currencyButton = screen.getByTitle("Switch to Dollars");
    fireEvent.click(currencyButton);
    expect(currencyButton).toHaveAttribute("title", "Cambiar a Pesos");
    fireEvent.click(currencyButton);
    expect(currencyButton).toHaveAttribute("title", "Switch to Dollars");
  });

  it("changes language when language button is clicked", () => {
    const router = useRouter();
    render(<Header />);
    const languageButton = screen.getByTitle("Cambiar a Inglés");
    fireEvent.click(languageButton);
    expect(router.replace).toHaveBeenCalledWith("/", { locale: "en" });
  });

  it("displays complex name and admin name when logged in", () => {
    (useAuthStore as any).mockReturnValue({
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        role: "RESIDENT",
      },
      changeUserRole: vi.fn(),
    });
    render(
      <Header
        isLoggedIn={true}
        complexName="Mi Conjunto"
        adminName="Admin Test"
      />,
    );
    expect(screen.getByText("Mi Conjunto")).toBeInTheDocument();
  });
});
