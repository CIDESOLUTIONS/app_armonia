'use client';
// Clase de utilidad para el logging en el cliente
export class ClientLogger {
    static isEnabled() {
        return typeof window !== 'undefined' && localStorage.getItem('debug') === 'true';
    }
    static debug(message, ...args) {
        if (this.isEnabled()) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    }
    static info(message, ...args) {
        console.log(`[INFO] ${message}`, ...args);
    }
    static warn(message, ...args) {
        console.warn(`[WARN] ${message}`, ...args);
    }
    static error(message, ...args) {
        console.error(`[ERROR] ${message}`, ...args);
    }
    static apiRequest(method, url, options) {
        this.debug(`API Request: ${method} ${url}`, options ? { options } : '');
    }
    static apiResponse(method, url, status, data) {
        if (status >= 400) {
            this.error(`API Response: ${method} ${url} [${status}]`, data ? { data } : '');
        }
        else {
            this.debug(`API Response: ${method} ${url} [${status}]`, data ? { data } : '');
        }
    }
    static navigation(path) {
        this.debug(`Navigation: ${path}`);
    }
    static userAction(action, details) {
        this.debug(`User Action: ${action}`, details ? { details } : '');
    }
    static componentRender(component, props) {
        if (this.isEnabled()) {
            this.debug(`Component Render: ${component}`, props ? { props } : '');
        }
    }
    static performance(operation, durationMs) {
        this.debug(`Performance: ${operation} took ${durationMs}ms`);
    }
    // Método para habilitar/deshabilitar debug logs
    static toggleDebug() {
        if (typeof window !== 'undefined') {
            const currentState = localStorage.getItem('debug') === 'true';
            localStorage.setItem('debug', (!currentState).toString());
            console.log(`Debug logs ${!currentState ? 'enabled' : 'disabled'}`);
            return !currentState;
        }
        return false;
    }
}
