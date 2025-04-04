'use client';

// Clase de utilidad para el logging en el cliente

export class ClientLogger {
  static isEnabled() {
    return typeof window !== 'undefined' && localStorage.getItem('debug') === 'true';
  }

  static debug(message: string, ...args: any[]) {
    if (this.isEnabled()) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]) {
    console.log(`[INFO] ${message}`, ...args);
  }

  static warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args);
  }

  static apiRequest(method: string, url: string, options?: any) {
    this.debug(`API Request: ${method} ${url}`, options ? { options } : '');
  }

  static apiResponse(method: string, url: string, status: number, data?: any) {
    if (status >= 400) {
      this.error(`API Response: ${method} ${url} [${status}]`, data ? { data } : '');
    } else {
      this.debug(`API Response: ${method} ${url} [${status}]`, data ? { data } : '');
    }
  }

  static navigation(path: string) {
    this.debug(`Navigation: ${path}`);
  }

  static userAction(action: string, details?: any) {
    this.debug(`User Action: ${action}`, details ? { details } : '');
  }

  static componentRender(component: string, props?: any) {
    if (this.isEnabled()) {
      this.debug(`Component Render: ${component}`, props ? { props } : '');
    }
  }

  static performance(operation: string, durationMs: number) {
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