var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Mock de jwtVerify
export const jwtVerify = (token, secret) => __awaiter(void 0, void 0, void 0, function* () {
    // Simulación simple para pruebas
    if (!token || token === 'invalid_token') {
        throw new Error('Invalid token');
    }
    // Devuelve un payload simulado
    return {
        payload: {
            sub: 'user_123',
            email: 'test@example.com',
            role: 'RESIDENT',
            schemaName: 'test_schema',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600
        }
    };
});
// Mock de SignJWT
export class SignJWT {
    constructor(payload) {
        this.payload = payload;
    }
    setProtectedHeader() {
        return this;
    }
    setIssuedAt() {
        return this;
    }
    setExpirationTime(time) {
        return this;
    }
    sign(secret) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'mock_jwt_token_for_testing';
        });
    }
}
