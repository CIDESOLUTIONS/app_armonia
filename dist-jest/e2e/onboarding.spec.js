var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Pruebas E2E para el flujo de Onboarding
 *
 * Estas pruebas verifican el flujo completo de registro de un nuevo conjunto
 * residencial y la creación de su administrador principal.
 */
import { test, expect } from '@playwright/test';
// Datos de prueba para conjunto residencial
const testComplex = {
    name: 'Conjunto Residencial Los Robles E2E Test',
    nit: '900123456-1',
    address: 'Calle 123 #45-67, Bogotá',
    phone: '(601) 234-5678',
    email: 'admin@losrobles-test.com',
    units: '48',
    towers: '2',
    floors: '6',
    commonAreas: 'Salón Social, Gimnasio, Piscina, Zona BBQ'
};
// Datos del administrador principal
const adminUser = {
    name: 'Carlos Administrador Test',
    email: 'carlos.admin@losrobles-test.com',
    phone: '3001234567',
    dni: '12345678',
    password: 'AdminTest123!',
    confirmPassword: 'AdminTest123!'
};
test.describe('Onboarding - Registro de Conjunto Residencial', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navegar a la página principal
        yield page.goto('/');
        // Esperar a que la página cargue completamente
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo de registro de conjunto residencial', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Navegar a página de registro
        yield test.step('Navegar a página de registro', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar y hacer clic en el botón de registro
            const registerButton = page.locator('text="Registrar Conjunto"').first();
            yield expect(registerButton).toBeVisible({ timeout: 10000 });
            yield registerButton.click();
            // Verificar que estamos en la página de registro
            yield expect(page).toHaveURL(/.*register-complex/);
            yield expect(page.locator('h1, h2')).toContainText(/registr/i);
        }));
        // PASO 2: Completar información del conjunto residencial
        yield test.step('Completar información del conjunto', () => __awaiter(void 0, void 0, void 0, function* () {
            // Llenar datos básicos del conjunto
            yield page.fill('input[name="name"], input[placeholder*="nombre"], #complex-name', testComplex.name);
            yield page.fill('input[name="nit"], input[placeholder*="nit"], #complex-nit', testComplex.nit);
            yield page.fill('input[name="address"], input[placeholder*="dirección"], #complex-address', testComplex.address);
            yield page.fill('input[name="phone"], input[placeholder*="teléfono"], #complex-phone', testComplex.phone);
            yield page.fill('input[name="email"], input[placeholder*="email"], #complex-email', testComplex.email);
            // Información de estructura
            yield page.fill('input[name="units"], input[placeholder*="unidades"], #units', testComplex.units);
            yield page.fill('input[name="towers"], input[placeholder*="torres"], #towers', testComplex.towers);
            yield page.fill('input[name="floors"], input[placeholder*="pisos"], #floors', testComplex.floors);
            // Áreas comunes (si hay campo de texto)
            const commonAreasField = page.locator('textarea[name="commonAreas"], input[name="commonAreas"], #common-areas').first();
            if (yield commonAreasField.isVisible()) {
                yield commonAreasField.fill(testComplex.commonAreas);
            }
        }));
        // PASO 3: Configurar administrador principal
        yield test.step('Configurar administrador principal', () => __awaiter(void 0, void 0, void 0, function* () {
            // Scroll hacia abajo para ver los campos del administrador
            yield page.locator('text=/administrador/i').first().scrollIntoViewIfNeeded();
            // Llenar datos del administrador
            yield page.fill('input[name="adminName"], input[placeholder*="nombre"], #admin-name', adminUser.name);
            yield page.fill('input[name="adminEmail"], input[placeholder*="email"], #admin-email', adminUser.email);
            yield page.fill('input[name="adminPhone"], input[placeholder*="teléfono"], #admin-phone', adminUser.phone);
            yield page.fill('input[name="adminDni"], input[placeholder*="documento"], #admin-dni', adminUser.dni);
            // Contraseñas
            yield page.fill('input[name="password"], input[type="password"]', adminUser.password);
            yield page.fill('input[name="confirmPassword"], input[placeholder*="confirmar"]', adminUser.confirmPassword);
        }));
        // PASO 4: Aceptar términos y condiciones
        yield test.step('Aceptar términos y condiciones', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar y marcar checkbox de términos
            const termsCheckbox = page.locator('input[type="checkbox"]').first();
            if (yield termsCheckbox.isVisible()) {
                yield termsCheckbox.check();
            }
        }));
        // PASO 5: Enviar formulario de registro
        yield test.step('Enviar formulario de registro', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar botón de envío
            const submitButton = page.locator('button[type="submit"], button:has-text("Registrar"), button:has-text("Crear")').first();
            yield expect(submitButton).toBeVisible();
            yield expect(submitButton).toBeEnabled();
            // Hacer clic en registrar
            yield submitButton.click();
            // Esperar respuesta del servidor
            yield page.waitForLoadState('networkidle');
        }));
        // PASO 6: Verificar registro exitoso
        yield test.step('Verificar registro exitoso', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar redirección o mensaje de éxito
            // Puede redirigir al login o mostrar mensaje de confirmación
            yield expect(page.locator('text=/éxito/i, text=/exitoso/i, text=/registrado/i, text=/creado/i')).toBeVisible({ timeout: 15000 });
            // O verificar redirección al login/dashboard
            yield page.waitForTimeout(2000);
            const currentUrl = page.url();
            expect(currentUrl).toMatch(/login|dashboard|success|confirmation/);
        }));
        // PASO 7: Verificar acceso del administrador
        yield test.step('Verificar acceso del administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            // Si no estamos en login, navegar allí
            if (!page.url().includes('login')) {
                yield page.goto('/login');
            }
            // Realizar login con las credenciales del administrador
            yield page.fill('input[name="email"], input[type="email"]', adminUser.email);
            yield page.fill('input[name="password"], input[type="password"]', adminUser.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")').first();
            yield loginButton.click();
            // Esperar carga del dashboard
            yield page.waitForLoadState('networkidle');
            // Verificar que estamos en el dashboard de administración
            yield expect(page).toHaveURL(/.*dashboard|admin/);
            yield expect(page.locator('text=/dashboard/i, text=/panel/i, text=/administración/i')).toBeVisible({ timeout: 10000 });
            // Verificar que aparece el nombre del conjunto o del usuario
            yield expect(page.locator(`text="${testComplex.name}", text="${adminUser.name}"`)).toBeVisible();
        }));
    }));
    test('Validación de campos requeridos en registro', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Navegar a registro
        yield page.goto('/register-complex');
        // Intentar enviar formulario vacío
        const submitButton = page.locator('button[type="submit"], button:has-text("Registrar")').first();
        if (yield submitButton.isVisible()) {
            yield submitButton.click();
            // Verificar que aparecen mensajes de validación
            yield expect(page.locator('text=/requerido/i, text=/obligatorio/i, .error, .invalid')).toBeVisible();
        }
    }));
    test('Validación de email duplicado', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Este test verificaría el comportamiento cuando se intenta registrar
        // un conjunto con un email que ya existe
        // Implementación depende de la lógica específica de la aplicación
        yield page.goto('/register-complex');
        // Llenar formulario con email existente conocido
        yield page.fill('input[name="email"], #complex-email', 'admin@existing-complex.com');
        yield page.fill('input[name="name"], #complex-name', 'Test Complex');
        // Enviar y verificar mensaje de error
        const submitButton = page.locator('button[type="submit"]').first();
        if (yield submitButton.isVisible()) {
            yield submitButton.click();
            yield expect(page.locator('text=/email.*existe/i, text=/ya.*registrado/i')).toBeVisible({ timeout: 10000 });
        }
    }));
});
