var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// lib/auth/authService.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const KEY = new TextEncoder().encode(SECRET_KEY);
export function encrypt(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(KEY);
    });
}
export function decrypt(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = yield jwtVerify(token, KEY);
            return payload;
        }
        catch (error) {
            throw new Error('Token inválido');
        }
    });
}
// Middleware de autenticación mejorado
export function authenticate(request) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const cookieStore = cookies();
        const _token = (_a = cookieStore.get('token')) === null || _a === void 0 ? void 0 : _a.value;
        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
        try {
            const session = yield decrypt(token);
            return session;
        }
        catch (error) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }
    });
}
