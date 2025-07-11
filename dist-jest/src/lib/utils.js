import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Combina múltiples clases de Tailwind de manera segura
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Formatea un valor monetario
 */
export function formatCurrency(amount, currency = 'COP') {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}
/**
 * Formatea una fecha a formato local
 */
export function formatDate(date, format = 'medium') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options = {
        year: 'numeric',
        month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
        day: 'numeric',
    };
    if (format === 'medium' || format === 'long') {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    return new Intl.DateTimeFormat('es-CO', options).format(dateObj);
}
/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
}
/**
 * Genera un color aleatorio en formato hexadecimal
 */
export function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
/**
 * Convierte un camelCase a Title Case
 */
export function camelToTitleCase(text) {
    const _result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}
/**
 * Genera un identificador único
 */
export function generateId() {
    return Math.random().toString(36).substring(2, 11);
}
/**
 * Comprueba si un valor es un objeto plano
 */
export function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
