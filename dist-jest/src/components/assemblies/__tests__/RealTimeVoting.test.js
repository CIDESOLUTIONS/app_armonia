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
// src/components/assemblies/__tests__/RealTimeVoting.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RealTimeVoting from '../RealTimeVoting';
import { toast } from '@/components/ui/use-toast';
// Mock de fetch
global.fetch = jest.fn();
// Mock de toast
jest.mock('@/components/ui/use-toast', () => ({
    toast: jest.fn()
}));
describe('RealTimeVoting Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('muestra estado de carga inicialmente', () => {
        // Mock de fetch para que no resuelva inmediatamente
        global.fetch.mockImplementation(() => new Promise(() => { }));
        render(_jsx(RealTimeVoting, { assemblyId: 1, agendaNumeral: 1, topic: "Test Topic", language: "Espa\u00F1ol", userVote: null, onVoteSubmitted: jest.fn() }));
        expect(screen.getByText('Cargando resultados...')).toBeInTheDocument();
    });
    it('muestra estadísticas de votación correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock de respuesta exitosa
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    totalVotes: 10,
                    yesVotes: 7,
                    noVotes: 3,
                    yesPercentage: 70,
                    noPercentage: 30,
                    isOpen: true,
                    endTime: null
                });
            })
        });
        render(_jsx(RealTimeVoting, { assemblyId: 1, agendaNumeral: 1, topic: "Test Topic", language: "Espa\u00F1ol", userVote: null, onVoteSubmitted: jest.fn() }));
        // Esperar a que se carguen los datos
        yield waitFor(() => {
            expect(screen.getByText('Votos totales: 10')).toBeInTheDocument();
        });
        expect(screen.getByText('70%')).toBeInTheDocument();
        expect(screen.getByText('30%')).toBeInTheDocument();
        expect(screen.getByText('Votación Abierta')).toBeInTheDocument();
    }));
    it('permite votar cuando la votación está abierta', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock para obtener estadísticas
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    totalVotes: 10,
                    yesVotes: 7,
                    noVotes: 3,
                    yesPercentage: 70,
                    noPercentage: 30,
                    isOpen: true,
                    endTime: null
                });
            })
        });
        // Mock para enviar voto
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ success: true }); })
        });
        // Mock para actualizar estadísticas después de votar
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    totalVotes: 11,
                    yesVotes: 8,
                    noVotes: 3,
                    yesPercentage: 73,
                    noPercentage: 27,
                    isOpen: true,
                    endTime: null
                });
            })
        });
        const onVoteSubmittedMock = jest.fn();
        render(_jsx(RealTimeVoting, { assemblyId: 1, agendaNumeral: 1, topic: "Test Topic", language: "Espa\u00F1ol", userVote: null, onVoteSubmitted: onVoteSubmittedMock }));
        // Esperar a que se carguen los datos
        yield waitFor(() => {
            expect(screen.getByText('Votar a favor')).toBeInTheDocument();
        });
        // Hacer clic en el botón de votar a favor
        fireEvent.click(screen.getByText('Votar a favor'));
        // Verificar que se llamó a fetch para enviar el voto
        yield waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/assemblies/1/agenda/1/votes', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ value: 'YES' })
            }));
        });
        // Verificar que se llamó al callback
        expect(onVoteSubmittedMock).toHaveBeenCalled();
        // Verificar que se mostró el toast
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Voto registrado'
        }));
    }));
    it('no muestra botones de votación cuando el usuario ya votó', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock de respuesta exitosa
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    totalVotes: 10,
                    yesVotes: 7,
                    noVotes: 3,
                    yesPercentage: 70,
                    noPercentage: 30,
                    isOpen: true,
                    endTime: null
                });
            })
        });
        render(_jsx(RealTimeVoting, { assemblyId: 1, agendaNumeral: 1, topic: "Test Topic", language: "Espa\u00F1ol", userVote: "YES" // Usuario ya votó
            , onVoteSubmitted: jest.fn() }));
        // Esperar a que se carguen los datos
        yield waitFor(() => {
            expect(screen.getByText('Votos totales: 10')).toBeInTheDocument();
        });
        // Verificar que no se muestran los botones de votación
        expect(screen.queryByText('Votar a favor')).not.toBeInTheDocument();
        expect(screen.queryByText('Votar en contra')).not.toBeInTheDocument();
    }));
    it('muestra mensaje de error cuando falla la carga', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock de respuesta fallida
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ error: 'Error de servidor' }); })
        });
        render(_jsx(RealTimeVoting, { assemblyId: 1, agendaNumeral: 1, topic: "Test Topic", language: "Espa\u00F1ol", userVote: null, onVoteSubmitted: jest.fn() }));
        // Esperar a que se muestre el error
        yield waitFor(() => {
            expect(screen.getByText('Error al cargar estadísticas de votación')).toBeInTheDocument();
        });
    }));
});
