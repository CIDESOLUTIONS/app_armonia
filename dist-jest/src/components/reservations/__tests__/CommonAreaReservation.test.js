var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommonAreaReservation from '../CommonAreaReservation';
// Mock next-auth
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({
        data: {
            user: {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                role: 'USER',
            },
        },
    })),
    SessionProvider: ({ children }) => (_jsx("div", { children: children })),
}));
// Mock fetch
global.fetch = jest.fn();
describe('CommonAreaReservation Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock successful fetch for common areas
        global.fetch.mockImplementation((url) => {
            if (url.includes('/api/common-areas')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        {
                            id: 1,
                            name: 'Salón Comunal',
                            description: 'Espacio para eventos sociales',
                            location: 'Primer piso',
                            capacity: 50,
                            isActive: true,
                            requiresApproval: false,
                            hasFee: false,
                        },
                        {
                            id: 2,
                            name: 'Piscina',
                            description: 'Área recreativa',
                            location: 'Terraza',
                            capacity: 30,
                            isActive: true,
                            requiresApproval: true,
                            hasFee: true,
                            feeAmount: 20000,
                        },
                    ]),
                });
            }
            else if (url.includes('/api/reservations')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        {
                            id: 1,
                            commonAreaId: 1,
                            userId: 1,
                            propertyId: 1,
                            title: 'Reunión familiar',
                            description: 'Celebración de cumpleaños',
                            startDateTime: '2025-06-15T14:00:00Z',
                            endDateTime: '2025-06-15T18:00:00Z',
                            status: 'APPROVED',
                            attendees: 20,
                            requiresPayment: false,
                            createdAt: '2025-06-01T10:00:00Z',
                            updatedAt: '2025-06-01T10:00:00Z',
                        },
                    ]),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            });
        });
    });
    it('renders the component title', () => __awaiter(void 0, void 0, void 0, function* () {
        render(_jsx(CommonAreaReservation, {}));
        expect(screen.getByText('Reserva de Áreas Comunes')).toBeInTheDocument();
    }));
    it('loads and displays common areas', () => __awaiter(void 0, void 0, void 0, function* () {
        render(_jsx(CommonAreaReservation, {}));
        yield waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/common-areas?active=true');
        });
        yield waitFor(() => {
            expect(screen.getByText('Salón Comunal')).toBeInTheDocument();
        });
    }));
});
