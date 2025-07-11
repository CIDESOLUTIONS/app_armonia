// src/lib/api/fetcher.ts
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ServerLogger } from '../logging/server-logger';
/**
 * Cliente HTTP unificado para llamadas a la API
 * @param url URL relativa o absoluta para la solicitud
 * @param options Opciones adicionales para la solicitud
 * @returns Promesa con la respuesta procesada
 */
export function fetcher(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        try {
            const { schema, skipAuth = false } = options, fetchOptions = __rest(options, ["schema", "skipAuth"]);
            const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
            // Construir URL completa si no es absoluta
            const fullUrl = isAbsoluteUrl ? url : url.startsWith('/') ? url : `/${url}`;
            // Configurar cabeceras por defecto
            const headers = new Headers(fetchOptions.headers);
            // Agregar headers comunes
            if (!headers.has('Content-Type') && !options.body) {
                headers.set('Content-Type', 'application/json');
            }
            // Agregar token de autenticación si está disponible y no se debe omitir
            if (!skipAuth) {
                const _token = localStorage.getItem('token');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
            }
            // Agregar schema si es necesario
            if (schema) {
                headers.set('X-Tenant-Schema', schema);
            }
            // Construir opciones finales de la solicitud
            const finalOptions = Object.assign(Object.assign({}, fetchOptions), { headers });
            // Realizar la solicitud
            // Variable response eliminada por lint
            // Verificar si hay respuesta
            if (!response.ok) {
                // Obtener detalles del error
                let errorData;
                try {
                    errorData = yield response.json();
                }
                catch (e) {
                    errorData = { message: response.statusText };
                }
                // Crear un error con detalles
                const error = new Error(errorData.message || 'Error en la solicitud');
                error.status = response.status;
                error.data = errorData;
                throw error;
            }
            // Para respuestas exitosas que no tienen contenido
            if (response.status === 204) {
                return {};
            }
            // Procesar respuesta como JSON
            const _data = yield response.json();
            return data;
        }
        catch (error) {
            ServerLogger.error(`Error en fetcher para ${url}:`, error);
            throw error;
        }
    });
}
/**
 * Cliente HTTP para solicitudes GET
 */
export function get(url, options = {}) {
    return fetcher(url, Object.assign(Object.assign({}, options), { method: 'GET' }));
}
/**
 * Cliente HTTP para solicitudes POST
 */
export function post(url, data, options = {}) {
    return fetcher(url, Object.assign(Object.assign({}, options), { method: 'POST', body: JSON.stringify(data) }));
}
/**
 * Cliente HTTP para solicitudes PUT
 */
export function put(url, data, options = {}) {
    return fetcher(url, Object.assign(Object.assign({}, options), { method: 'PUT', body: JSON.stringify(data) }));
}
/**
 * Cliente HTTP para solicitudes PATCH
 */
export function patch(url, data, options = {}) {
    return fetcher(url, Object.assign(Object.assign({}, options), { method: 'PATCH', body: JSON.stringify(data) }));
}
/**
 * Cliente HTTP para solicitudes DELETE
 */
export function del(url, options = {}) {
    return fetcher(url, Object.assign(Object.assign({}, options), { method: 'DELETE' }));
}
