var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateToken, verifyToken } from '../src/lib/auth';
// Mock de las dependencias
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked-token'),
    verify: jest.fn((token) => {
        if (token === 'valid-token') {
            return { id: 1, email: 'test@example.com' };
        }
        throw new Error('Invalid token');
    }),
}));
describe('Auth Service', () => {
    test('generateToken debe generar un token con los datos correctos', () => {
        const payload = { id: 1, email: 'test@example.com' };
        const token = generateToken(payload);
        expect(token).toBe('mocked-token');
    });
    test('verifyToken debe retornar los datos del token si es válido', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield verifyToken('valid-token');
        expect(result).toEqual({ id: 1, email: 'test@example.com' });
    }));
    test('verifyToken debe rechazar si el token es inválido', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(verifyToken('invalid-token')).rejects.toThrow('Invalid token');
    }));
});
