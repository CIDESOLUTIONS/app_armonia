import React from "react";
import { render, screen, waitFor } from "@/__mocks__/test-utils";
import "@testing-library/jest-dom";
import CommonAreaReservation from "../CommonAreaReservation";
import { vi } from 'vitest';

// Mock de @/hooks/useReservationsWithPayments a nivel de archivo
vi.mock("@/hooks/useReservationsWithPayments", () => ({
  useReservationsWithPayments: () => ({
    commonAreas: [],
    selectedArea: undefined,
    myReservations: [],
    calendarEvents: [],
    viewDate: new Date(),
    isLoading: false,
    isCreatingReservation: false,
    reservationForm: {
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      commonAreaId: null,
      propertyId: null,
      status: "PENDING",
      requiresPayment: false,
      attendees: 1,
    },
    isReservationDialogOpen: false,
    selectedReservation: null,
    isDetailDialogOpen: false,
    isPaymentModalOpen: false,
    setSelectedArea: vi.fn(),
    setViewDate: vi.fn(),
    fetchReservations: vi.fn(),
    setReservationForm: vi.fn(),
    setIsReservationDialogOpen: vi.fn(),
    setIsDetailDialogOpen: vi.fn(),
    setIsPaymentModalOpen: vi.fn(),
    handleCreateReservation: vi.fn(),
    handleCancelReservation: vi.fn(),
    handleEventClick: vi.fn(),
    handleNewReservation: vi.fn(),
    handlePaymentComplete: vi.fn(),
    selectedProperty: { id: 1, name: "Dummy Property" },
  }),
}));

// Mock next-auth (needed because CommonAreaReservation uses useSession directly)
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "USER",
      },
    },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock fetch (needed because CommonAreaReservation makes fetch calls directly)
global.fetch = vi.fn();

describe("CommonAreaReservation Component - New Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful fetch for common areas
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("/api/common-areas")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                name: "Salón Comunal",
                description: "Espacio para eventos sociales",
                location: "Primer piso",
                capacity: 50,
                isActive: true,
                requiresApproval: false,
                hasFee: false,
              },
              {
                id: 2,
                name: "Piscina",
                description: "Área recreativa",
                location: "Terraza",
                capacity: 30,
                isActive: true,
                requiresApproval: true,
                hasFee: true,
                feeAmount: 20000,
              },
            ]),
        });
      } else if (url.includes("/api/reservations")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                commonAreaId: 1,
                userId: 1,
                propertyId: 1,
                title: "Reunión familiar",
                description: "Celebración de cumpleaños",
                startDateTime: "2025-06-15T14:00:00Z",
                endDateTime: "2025-06-15T18:00:00Z",
                status: "APPROVED",
                attendees: 20,
                requiresPayment: false,
                createdAt: "2025-06-01T10:00:00Z",
                updatedAt: "2025-06-01T10:00:00Z",
              },
            ]),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it("renders the component title", async () => {
    render(<CommonAreaReservation />);
    expect(screen.getByText("Reserva de Áreas Comunes")).toBeInTheDocument();
  });

  it("loads and displays common areas", async () => {
    render(<CommonAreaReservation />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/common-areas?active=true",
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Salón Comunal")).toBeInTheDocument();
    });
  });
});