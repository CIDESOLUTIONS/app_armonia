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
 * Pruebas E2E para el módulo de Finanzas
 *
 * Estas pruebas verifican el flujo completo de facturación y pagos:
 * creación de facturas, procesamiento de pagos y verificación de estados de cuenta.
 */
import { test, expect } from '@playwright/test';
// Datos de prueba
const testUsers = {
    admin: {
        email: 'admin.financiero@test.com',
        password: 'FinAdmin123!',
        name: 'Admin Financiero'
    },
    resident: {
        email: 'residente.test@email.com',
        password: 'Resident123!',
        name: 'Juan Residente Test',
        unitNumber: 'Apto 101'
    }
};
const testInvoice = {
    description: 'Cuota de Administración - Enero 2025',
    amount: '350000',
    dueDate: '2025-02-15',
    type: 'MONTHLY_FEE',
    concept: 'Administración mensual'
};
const testPayment = {
    method: 'CREDIT_CARD',
    cardNumber: '4111111111111111',
    expiryDate: '12/26',
    cvv: '123',
    cardName: 'JUAN RESIDENTE TEST'
};
test.describe('Finanzas - Facturación y Pagos', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Configurar timeouts más largos para transacciones financieras
        test.setTimeout(60000);
        yield page.goto('/');
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo: Crear factura, procesar pago y verificar estado de cuenta', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Login como administrador financiero
        yield test.step('Login como administrador financiero', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/login');
            yield page.fill('input[name="email"], input[type="email"]', testUsers.admin.email);
            yield page.fill('input[name="password"], input[type="password"]', testUsers.admin.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|admin/);
        }));
        // PASO 2: Navegar al módulo de finanzas
        yield test.step('Navegar al módulo de finanzas', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar enlace de finanzas en el menú
            const financeLink = page.locator('a:has-text("Finanzas"), a:has-text("Facturación"), [href*="finance"]').first();
            yield expect(financeLink).toBeVisible({ timeout: 10000 });
            yield financeLink.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*financ|billing|invoice/);
        }));
        // PASO 3: Crear nueva factura para residente
        yield test.step('Crear nueva factura', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar botón de crear factura
            const createInvoiceButton = page.locator('button:has-text("Crear"), button:has-text("Nueva"), button:has-text("Factura")').first();
            yield expect(createInvoiceButton).toBeVisible({ timeout: 10000 });
            yield createInvoiceButton.click();
            // Esperar que aparezca el formulario
            yield expect(page.locator('form, .modal, .dialog')).toBeVisible();
            // Seleccionar residente (buscar por unidad o nombre)
            const residentSelect = page.locator('select[name="resident"], input[name="resident"], #resident-select').first();
            if (yield residentSelect.isVisible()) {
                yield residentSelect.click();
                yield page.locator(`option:has-text("${testUsers.resident.unitNumber}"), option:has-text("${testUsers.resident.name}")`).first().click();
            }
            // Llenar datos de la factura
            yield page.fill('input[name="description"], #invoice-description', testInvoice.description);
            yield page.fill('input[name="amount"], #invoice-amount', testInvoice.amount);
            yield page.fill('input[name="dueDate"], input[type="date"], #due-date', testInvoice.dueDate);
            // Seleccionar tipo de factura si existe
            const typeSelect = page.locator('select[name="type"], #invoice-type').first();
            if (yield typeSelect.isVisible()) {
                yield typeSelect.selectOption(testInvoice.type);
            }
            // Enviar formulario
            const submitButton = page.locator('button[type="submit"], button:has-text("Crear"), button:has-text("Generar")').first();
            yield submitButton.click();
            // Verificar creación exitosa
            yield expect(page.locator('text=/creada/i, text=/generada/i, text=/éxito/i')).toBeVisible({ timeout: 15000 });
        }));
        // PASO 4: Logout del admin y login como residente
        yield test.step('Cambiar a usuario residente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Logout
            const logoutButton = page.locator('button:has-text("Salir"), button:has-text("Logout"), a:has-text("Cerrar")').first();
            if (yield logoutButton.isVisible()) {
                yield logoutButton.click();
            }
            else {
                yield page.goto('/logout');
            }
            yield page.waitForLoadState('networkidle');
            // Login como residente
            yield page.goto('/login');
            yield page.fill('input[name="email"], input[type="email"]', testUsers.resident.email);
            yield page.fill('input[name="password"], input[type="password"]', testUsers.resident.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|resident/);
        }));
        // PASO 5: Ver facturas pendientes
        yield test.step('Ver facturas pendientes', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a facturas/pagos
            const paymentsLink = page.locator('a:has-text("Facturas"), a:has-text("Pagos"), a:has-text("Finanzas"), [href*="payment"]').first();
            yield expect(paymentsLink).toBeVisible({ timeout: 10000 });
            yield paymentsLink.click();
            yield page.waitForLoadState('networkidle');
            // Verificar que aparece la factura creada
            yield expect(page.locator(`text="${testInvoice.description}"`)).toBeVisible();
            yield expect(page.locator(`text="$${testInvoice.amount}", text="${testInvoice.amount}"`)).toBeVisible();
        }));
        // PASO 6: Procesar pago de la factura
        yield test.step('Procesar pago de factura', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar y hacer clic en botón de pagar
            const payButton = page.locator('button:has-text("Pagar"), button:has-text("Pay"), .pay-button').first();
            yield expect(payButton).toBeVisible();
            yield payButton.click();
            // Esperar formulario de pago
            yield expect(page.locator('form, .payment-form, .modal')).toBeVisible();
            // Seleccionar método de pago
            const paymentMethodSelect = page.locator('select[name="method"], #payment-method').first();
            if (yield paymentMethodSelect.isVisible()) {
                yield paymentMethodSelect.selectOption(testPayment.method);
            }
            // Llenar datos de tarjeta (si es pago con tarjeta)
            if (testPayment.method === 'CREDIT_CARD') {
                yield page.fill('input[name="cardNumber"], #card-number', testPayment.cardNumber);
                yield page.fill('input[name="expiryDate"], #expiry-date', testPayment.expiryDate);
                yield page.fill('input[name="cvv"], #cvv', testPayment.cvv);
                yield page.fill('input[name="cardName"], #card-name', testPayment.cardName);
            }
            // Confirmar pago
            const confirmPayButton = page.locator('button[type="submit"], button:has-text("Confirmar"), button:has-text("Pagar")').first();
            yield confirmPayButton.click();
            // Esperar procesamiento del pago
            yield page.waitForLoadState('networkidle');
            // Verificar pago exitoso
            yield expect(page.locator('text=/pago.*exitoso/i, text=/transacción.*aprobada/i, text=/pagado/i')).toBeVisible({ timeout: 20000 });
        }));
        // PASO 7: Verificar estado de cuenta actualizado
        yield test.step('Verificar estado de cuenta', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a estado de cuenta
            const accountLink = page.locator('a:has-text("Estado de Cuenta"), a:has-text("Mi Cuenta"), [href*="account"]').first();
            if (yield accountLink.isVisible()) {
                yield accountLink.click();
                yield page.waitForLoadState('networkidle');
            }
            // Verificar que el pago aparece registrado
            yield expect(page.locator(`text="${testInvoice.description}"`)).toBeVisible();
            yield expect(page.locator('text=/pagado/i, text=/paid/i, .status-paid')).toBeVisible();
            // Verificar saldo actualizado (debe ser 0 o menor)
            const balanceElement = page.locator('[data-testid="balance"], .balance, .saldo').first();
            if (yield balanceElement.isVisible()) {
                const balanceText = yield balanceElement.textContent();
                // El saldo debería ser 0 o mostrar que no hay deudas pendientes
                expect(balanceText).toMatch(/0|sin.*deuda|al.*día/i);
            }
        }));
        // PASO 8: Verificar desde lado administrativo
        yield test.step('Verificar pago desde administración', () => __awaiter(void 0, void 0, void 0, function* () {
            // Logout del residente
            const logoutButton = page.locator('button:has-text("Salir"), a:has-text("Cerrar")').first();
            if (yield logoutButton.isVisible()) {
                yield logoutButton.click();
            }
            else {
                yield page.goto('/logout');
            }
            // Login como admin nuevamente
            yield page.goto('/login');
            yield page.fill('input[name="email"]', testUsers.admin.email);
            yield page.fill('input[name="password"]', testUsers.admin.password);
            yield page.locator('button[type="submit"]').click();
            yield page.waitForLoadState('networkidle');
            // Navegar a reportes de pagos o transacciones
            const reportsLink = page.locator('a:has-text("Reportes"), a:has-text("Transacciones"), [href*="report"]').first();
            if (yield reportsLink.isVisible()) {
                yield reportsLink.click();
                yield page.waitForLoadState('networkidle');
                // Verificar que aparece el pago recibido
                yield expect(page.locator(`text="${testUsers.resident.name}", text="${testUsers.resident.unitNumber}"`)).toBeVisible();
                yield expect(page.locator('text=/recibido/i, text=/pagado/i, .status-paid')).toBeVisible();
            }
        }));
    }));
    test('Validación de campos en formulario de pago', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como residente
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.resident.email);
        yield page.fill('input[name="password"]', testUsers.resident.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a pagos
        const paymentsLink = page.locator('a:has-text("Facturas"), a:has-text("Pagos")').first();
        if (yield paymentsLink.isVisible()) {
            yield paymentsLink.click();
            // Intentar pagar sin llenar datos
            const payButton = page.locator('button:has-text("Pagar")').first();
            if (yield payButton.isVisible()) {
                yield payButton.click();
                const confirmButton = page.locator('button[type="submit"], button:has-text("Confirmar")').first();
                if (yield confirmButton.isVisible()) {
                    yield confirmButton.click();
                    // Verificar mensajes de validación
                    yield expect(page.locator('text=/requerido/i, text=/obligatorio/i, .error')).toBeVisible();
                }
            }
        }
    }));
    test('Manejo de pago fallido', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Este test simularía un escenario donde el pago falla
        // (tarjeta inválida, fondos insuficientes, etc.)
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.resident.email);
        yield page.fill('input[name="password"]', testUsers.resident.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a pagos y usar tarjeta inválida
        const paymentsLink = page.locator('a:has-text("Pagos")').first();
        if (yield paymentsLink.isVisible()) {
            yield paymentsLink.click();
            const payButton = page.locator('button:has-text("Pagar")').first();
            if (yield payButton.isVisible()) {
                yield payButton.click();
                // Usar número de tarjeta inválido
                yield page.fill('input[name="cardNumber"]', '4000000000000002'); // Tarjeta que falla
                yield page.fill('input[name="expiryDate"]', '12/26');
                yield page.fill('input[name="cvv"]', '123');
                const confirmButton = page.locator('button[type="submit"]').first();
                if (yield confirmButton.isVisible()) {
                    yield confirmButton.click();
                    // Verificar mensaje de error
                    yield expect(page.locator('text=/error/i, text=/fallido/i, text=/rechazado/i')).toBeVisible({ timeout: 15000 });
                }
            }
        }
    }));
});
