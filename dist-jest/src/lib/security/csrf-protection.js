/**
 * CSRF Protection Middleware
 *
 * Este middleware implementa protección contra ataques CSRF (Cross-Site Request Forgery)
 * utilizando tokens CSRF que deben ser incluidos en todas las solicitudes POST, PUT, DELETE.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
// Nombre de la cookie y header para el token CSRF
const CSRF_COOKIE_NAME = 'armonia-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
/**
 * Genera un token CSRF aleatorio
 */
export function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}
/**
 * Establece un token CSRF en las cookies
 */
export function setCsrfToken(response) {
    const token = generateCsrfToken();
    // Configurar la cookie con opciones de seguridad
    response.cookies.set({
        name: CSRF_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    return token;
}
/**
 * Obtiene el token CSRF actual de las cookies
 */
export function getCsrfToken() {
    var _a;
    const cookieStore = cookies();
    return (_a = cookieStore.get(CSRF_COOKIE_NAME)) === null || _a === void 0 ? void 0 : _a.value;
}
/**
 * Middleware para validar tokens CSRF en solicitudes mutables
 */
export function validateCsrfToken(request) {
    var _a;
    // Solo validar en métodos que modifican datos
    const mutableMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (!mutableMethods.includes(request.method)) {
        return true;
    }
    // Obtener token de la cookie y del header
    const cookieToken = (_a = request.cookies.get(CSRF_COOKIE_NAME)) === null || _a === void 0 ? void 0 : _a.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    // Validar que ambos tokens existan y coincidan
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return false;
    }
    return true;
}
/**
 * Middleware para protección CSRF
 */
export function csrfProtection(handler) {
    return (request, ...args) => __awaiter(this, void 0, void 0, function* () {
        // Verificar si la protección CSRF está habilitada en la configuración
        const config = yield import('@/config/security').then(mod => mod.default);
        if (!config.csrfProtection) {
            return handler(request, ...args);
        }
        // Validar token CSRF para métodos mutables
        if (!validateCsrfToken(request)) {
            return new NextResponse(JSON.stringify({
                error: 'Invalid CSRF token',
                message: 'La solicitud no pudo ser procesada por razones de seguridad'
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // Continuar con el handler si la validación es exitosa
        return handler(request, ...args);
    });
}
/**
 * Hook para usar en componentes del cliente para obtener y manejar tokens CSRF
 */
export function useCsrfToken() {
    const getCsrfTokenForRequest = () => __awaiter(this, void 0, void 0, function* () {
        try {
            // Implementación correcta para obtener el token CSRF
            const response = yield fetch('/api/security/csrf-token');
            if (!response.ok) {
                throw new Error('Error al obtener token CSRF');
            }
            const data = yield response.json();
            return data.csrfToken;
        }
        catch (error) {
            console.error('Error al obtener token CSRF:', error);
            return null;
        }
    });
    return { getCsrfTokenForRequest };
}
