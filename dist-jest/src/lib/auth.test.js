var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/lib/auth.test.ts
import { generateToken, verifyToken, extractTokenFromHeader } from './auth';
import jwt from 'jsonwebtoken';
// Mock de jwt
jest.mock('jose', () => ({
    jwtVerify: jest.fn((token, secret) => {
        if (token === 'valid-token' && secret) {
            return Promise.resolve({ payload: { id: 1, email: 'test@example.com', role: 'ADMIN', name: 'Test User' } });
        }
        throw new Error('Invalid token');
    }),
    SignJWT: jest.fn().mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue('mock-token'),
    })),
}));
const mockJwtSecret = 'test-secret';
process.env.JWT_SECRET = mockJwtSecret;
describe('Funciones de autenticación', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('generateToken', () => {
        it('debe generar un token con los datos correctos', () => {
            const mockPayload = {
                id: 1,
                email: 'test@example.com',
                role: 'ADMIN',
                name: 'Test User',
            };
            jwt.sign.mockReturnValue('mock-token');
            const _token = generateToken(mockPayload);
            expect(jwt.sign).toHaveBeenCalledWith(mockPayload, mockJwtSecret, { expiresIn: '24h' });
            expect(token).toBe('mock-token');
        });
        it('debe lanzar un error si falla la generación del token', () => {
            const mockPayload = {
                id: 1,
                email: 'test@example.com',
                role: 'ADMIN',
                name: 'Test User',
            };
            jwt.sign.mockImplementation(() => {
                throw new Error('Error de firma');
            });
            expect(() => generateToken(mockPayload)).toThrow('Error al generar token de autenticación');
        });
    });
    describe('verifyToken', () => {
        it('debe verificar y devolver el payload de un token válido', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPayload = {
                id: 1,
                email: 'test@example.com',
                role: 'ADMIN',
                name: 'Test User',
            };
            jwt.verify.mockReturnValue(mockPayload);
            yield expect(verifyToken('valid-token')).resolves.toEqual(mockPayload);
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', mockJwtSecret);
        }));
        it('debe rechazar con un error si el token es inválido', () => __awaiter(void 0, void 0, void 0, function* () {
            require('jose').jwtVerify.mockImplementation(() => {
                throw new Error('Token inválido');
            });
            yield expect(verifyToken('invalid-token')).rejects.toThrow('Token inválido o expirado');
        }));
    });
    describe('extractTokenFromHeader', () => {
        it('debe extraer correctamente el token del header', () => {
            const token = extractTokenFromHeader('Bearer valid-token');
            expect(token).toBe('valid-token');
        });
        it('debe devolver null si el header no tiene el formato correcto', () => {
            const token1 = extractTokenFromHeader('invalid-format');
            const token2 = extractTokenFromHeader(undefined);
            expect(token1).toBeNull();
            expect(token2).toBeNull();
        });
    });
});
