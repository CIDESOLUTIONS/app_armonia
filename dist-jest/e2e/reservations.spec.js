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
 * Pruebas E2E para el módulo de Reservas
 *
 * Estas pruebas verifican el flujo completo de reservas de áreas comunes:
 * consulta de disponibilidad, creación de reserva y procesamiento de pago.
 */
import { test, expect } from '@playwright/test';
// Datos de prueba
const testUsers = {
    admin: {
        email: 'admin.reservas@test.com',
        password: 'ReservAdmin123!',
        name: 'Admin Reservas'
    },
    resident1: {
        email: 'residente.reservas@test.com',
        password: 'Resident123!',
        name: 'María Resident Test',
        unitNumber: 'Apto 504',
        phone: '3001234567'
    },
    resident2: {
        email: 'residente2.reservas@test.com',
        password: 'Resident456!',
        name: 'Carlos Resident Test',
        unitNumber: 'Apto 602'
    }
};
const testCommonAreas = [
    {
        name: 'Salón Social',
        capacity: '50 personas',
        hourlyRate: '80000',
        minimumHours: '4',
        description: 'Salón social con cocina, mesas, sillas y sonido',
        amenities: ['Cocina equipada', 'Sistema de sonido', 'Aire acondicionado', 'Baño privado']
    },
    {
        name: 'Zona BBQ',
        capacity: '30 personas',
        hourlyRate: '50000',
        minimumHours: '3',
        description: 'Zona de parrillas con mesas y asadores',
        amenities: ['3 Parrillas', 'Mesas y sillas', 'Lavaplatos', 'Zona cubierta']
    },
    {
        name: 'Gimnasio',
        capacity: '15 personas',
        hourlyRate: '25000',
        minimumHours: '2',
        description: 'Gimnasio con equipos de cardio y pesas',
        amenities: ['Equipos de cardio', 'Pesas libres', 'Espejo', 'Aire acondicionado']
    }
];
const testReservation = {
    area: 'Salón Social',
    date: '2025-03-20', // Fecha futura
    startTime: '14:00',
    endTime: '18:00',
    duration: 4, // horas
    purpose: 'Cumpleaños familiar',
    estimatedGuests: '25',
    additionalServices: ['Decoración básica', 'Limpieza post-evento'],
    contactPhone: '3001234567',
    specialRequests: 'Necesito acceso desde las 13:30 para decorar'
};
const testPayment = {
    method: 'CREDIT_CARD',
    cardNumber: '4111111111111111',
    expiryDate: '12/26',
    cvv: '123',
    cardName: 'MARIA RESIDENT TEST',
    installments: '1'
};
test.describe('Reservas - Áreas Comunes', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test.setTimeout(90000); // Timeout extendido para transacciones de pago
        yield page.goto('/');
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo: Consultar disponibilidad, reservar y pagar área común', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Login como residente
        yield test.step('Login como residente', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/login');
            yield page.fill('input[name="email"], input[type="email"]', testUsers.resident1.email);
            yield page.fill('input[name="password"], input[type="password"]', testUsers.resident1.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|resident/);
        }));
        // PASO 2: Navegar al módulo de reservas
        yield test.step('Navegar al módulo de reservas', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar enlace de reservas en el menú
            const reservationsLink = page.locator('a:has-text("Reservas"), a:has-text("Áreas Comunes"), [href*="reserv"]').first();
            yield expect(reservationsLink).toBeVisible({ timeout: 10000 });
            yield reservationsLink.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*reserv|common|area/);
        }));
        // PASO 3: Consultar áreas comunes disponibles
        yield test.step('Consultar áreas comunes disponibles', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar que se muestran las áreas comunes
            for (const area of testCommonAreas) {
                yield expect(page.locator(`text="${area.name}"`)).toBeVisible();
                yield expect(page.locator(`text="${area.capacity}"`)).toBeVisible();
            }
            // Ver detalles del Salón Social
            const salonSocialCard = page.locator(`text="${testReservation.area}"`).first();
            yield salonSocialCard.click();
            // Verificar detalles del área
            yield expect(page.locator(`text="${testCommonAreas[0].description}"`)).toBeVisible();
            yield expect(page.locator(`text="${testCommonAreas[0].hourlyRate}"`)).toBeVisible();
        }));
        // PASO 4: Consultar disponibilidad para fecha específica
        yield test.step('Consultar disponibilidad para fecha específica', () => __awaiter(void 0, void 0, void 0, function* () {
            // Seleccionar fecha
            const dateInput = page.locator('input[name="date"], input[type="date"], #reservation-date').first();
            yield dateInput.fill(testReservation.date);
            // Buscar disponibilidad
            const checkAvailabilityButton = page.locator('button:has-text("Consultar"), button:has-text("Ver Disponibilidad")').first();
            if (yield checkAvailabilityButton.isVisible()) {
                yield checkAvailabilityButton.click();
                yield page.waitForLoadState('networkidle');
            }
            // Verificar que se muestra el calendario/horarios disponibles
            yield expect(page.locator('text=/disponible/i, .available, .time-slot')).toBeVisible();
        }));
        // PASO 5: Crear nueva reserva
        yield test.step('Crear nueva reserva', () => __awaiter(void 0, void 0, void 0, function* () {
            // Hacer clic en el botón de reservar
            const reserveButton = page.locator('button:has-text("Reservar"), button:has-text("Crear Reserva")').first();
            yield expect(reserveButton).toBeVisible();
            yield reserveButton.click();
            // Esperar que aparezca el formulario de reserva
            yield expect(page.locator('form, .reservation-form, .modal')).toBeVisible();
            // Llenar detalles de la reserva
            yield page.fill('input[name="startTime"], input[type="time"], #start-time', testReservation.startTime);
            yield page.fill('input[name="endTime"], input[type="time"], #end-time', testReservation.endTime);
            yield page.fill('input[name="purpose"], #reservation-purpose', testReservation.purpose);
            yield page.fill('input[name="guests"], #estimated-guests', testReservation.estimatedGuests);
            yield page.fill('input[name="phone"], #contact-phone', testReservation.contactPhone);
            // Servicios adicionales (si existen checkboxes)
            for (const service of testReservation.additionalServices) {
                const serviceCheckbox = page.locator(`input[type="checkbox"][value*="${service}"], label:has-text("${service}")~input`).first();
                if (yield serviceCheckbox.isVisible()) {
                    yield serviceCheckbox.check();
                }
            }
            // Solicitudes especiales
            const specialRequestsField = page.locator('textarea[name="specialRequests"], #special-requests').first();
            if (yield specialRequestsField.isVisible()) {
                yield specialRequestsField.fill(testReservation.specialRequests);
            }
            // Verificar cálculo automático del costo
            const totalCost = testCommonAreas[0].hourlyRate * testReservation.duration;
            yield expect(page.locator(`text="${totalCost}", text="$${totalCost}"`)).toBeVisible();
        }));
        // PASO 6: Confirmar y proceder al pago
        yield test.step('Confirmar reserva y proceder al pago', () => __awaiter(void 0, void 0, void 0, function* () {
            // Aceptar términos y condiciones
            const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], #accept-terms').first();
            if (yield termsCheckbox.isVisible()) {
                yield termsCheckbox.check();
            }
            // Confirmar reserva
            const confirmButton = page.locator('button[type="submit"], button:has-text("Confirmar"), button:has-text("Continuar")').first();
            yield confirmButton.click();
            // Esperar redirección a página de pago
            yield page.waitForLoadState('networkidle');
            yield expect(page.locator('text=/pago/i, text=/payment/i, .payment-form')).toBeVisible({ timeout: 15000 });
        }));
        // PASO 7: Procesar pago de la reserva
        yield test.step('Procesar pago de la reserva', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar resumen de la reserva en página de pago
            yield expect(page.locator(`text="${testReservation.area}"`)).toBeVisible();
            yield expect(page.locator(`text="${testReservation.date}"`)).toBeVisible();
            yield expect(page.locator(`text="${testReservation.startTime}"`)).toBeVisible();
            // Seleccionar método de pago
            const paymentMethodSelect = page.locator('select[name="paymentMethod"], #payment-method').first();
            if (yield paymentMethodSelect.isVisible()) {
                yield paymentMethodSelect.selectOption(testPayment.method);
            }
            // Llenar datos de tarjeta
            yield page.fill('input[name="cardNumber"], #card-number', testPayment.cardNumber);
            yield page.fill('input[name="expiryDate"], #expiry-date', testPayment.expiryDate);
            yield page.fill('input[name="cvv"], #cvv', testPayment.cvv);
            yield page.fill('input[name="cardName"], #card-name', testPayment.cardName);
            // Seleccionar cuotas si aplica
            const installmentsSelect = page.locator('select[name="installments"], #installments').first();
            if (yield installmentsSelect.isVisible()) {
                yield installmentsSelect.selectOption(testPayment.installments);
            }
            // Procesar pago
            const payButton = page.locator('button[type="submit"], button:has-text("Pagar"), button:has-text("Procesar")').first();
            yield payButton.click();
            // Esperar procesamiento y confirmación
            yield page.waitForLoadState('networkidle');
            yield expect(page.locator('text=/pago.*exitoso/i, text=/reserva.*confirmada/i, text=/transacción.*aprobada/i')).toBeVisible({ timeout: 20000 });
        }));
        // PASO 8: Verificar confirmación de reserva
        yield test.step('Verificar confirmación de reserva', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar detalles de la reserva confirmada
            yield expect(page.locator(`text="${testReservation.area}"`)).toBeVisible();
            yield expect(page.locator(`text="${testReservation.date}"`)).toBeVisible();
            yield expect(page.locator('text=/confirmada/i, text=/aprobada/i')).toBeVisible();
            // Verificar número de confirmación o código de reserva
            const confirmationCode = page.locator('[data-testid="confirmation-code"], .confirmation-number').first();
            if (yield confirmationCode.isVisible()) {
                const codeText = yield confirmationCode.textContent();
                expect(codeText).toMatch(/[A-Z0-9]{6,}/); // Formato típico de código de confirmación
            }
            // Opción de descargar comprobante
            const downloadReceiptButton = page.locator('button:has-text("Descargar"), a:has-text("Comprobante")').first();
            if (yield downloadReceiptButton.isVisible()) {
                // Verificar que el botón está disponible (no necesariamente hacer clic)
                yield expect(downloadReceiptButton).toBeEnabled();
            }
        }));
        // PASO 9: Verificar reserva en calendario personal
        yield test.step('Verificar reserva en calendario personal', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a "Mis Reservas" o calendario
            const myReservationsLink = page.locator('a:has-text("Mis Reservas"), a:has-text("Mi Calendario"), [href*="my-reserv"]').first();
            if (yield myReservationsLink.isVisible()) {
                yield myReservationsLink.click();
            }
            else {
                yield page.goto('/reservations/my-reservations');
            }
            yield page.waitForLoadState('networkidle');
            // Verificar que aparece la reserva en la lista
            yield expect(page.locator(`text="${testReservation.area}"`)).toBeVisible();
            yield expect(page.locator(`text="${testReservation.date}"`)).toBeVisible();
            yield expect(page.locator('text=/confirmada/i, text=/activa/i')).toBeVisible();
        }));
    }));
    test('Validación de conflictos de horario', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como residente 1
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.resident1.email);
        yield page.fill('input[name="password"]', testUsers.resident1.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Intentar reservar en horario ya ocupado
        yield page.locator('a:has-text("Reservas")').first().click();
        yield page.locator(`text="${testReservation.area}"`).click();
        // Seleccionar misma fecha y horario
        yield page.fill('input[name="date"]', testReservation.date);
        yield page.fill('input[name="startTime"]', testReservation.startTime);
        yield page.fill('input[name="endTime"]', testReservation.endTime);
        const reserveButton = page.locator('button:has-text("Reservar")').first();
        if (yield reserveButton.isVisible()) {
            yield reserveButton.click();
            // Verificar mensaje de conflicto
            yield expect(page.locator('text=/no.*disponible/i, text=/ocupado/i, text=/conflicto/i')).toBeVisible();
        }
    }));
    test('Cancelación de reserva por residente', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como residente
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.resident1.email);
        yield page.fill('input[name="password"]', testUsers.resident1.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Ir a mis reservas
        yield page.locator('a:has-text("Mis Reservas")').first().click();
        // Buscar reserva activa y cancelar
        const cancelButton = page.locator('button:has-text("Cancelar"), .cancel-reservation').first();
        if (yield cancelButton.isVisible()) {
            yield cancelButton.click();
            // Confirmar cancelación
            const confirmCancelButton = page.locator('button:has-text("Confirmar Cancelación"), button:has-text("Sí")').first();
            if (yield confirmCancelButton.isVisible()) {
                yield confirmCancelButton.click();
                // Verificar cancelación exitosa
                yield expect(page.locator('text=/cancelada/i, text=/anulada/i')).toBeVisible();
            }
        }
    }));
    test('Gestión de reservas por administrador', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a gestión de reservas
        yield page.locator('a:has-text("Reservas"), a:has-text("Gestión")').first().click();
        // Ver todas las reservas
        const allReservationsTab = page.locator('tab:has-text("Todas"), button:has-text("Ver Todas")').first();
        if (yield allReservationsTab.isVisible()) {
            yield allReservationsTab.click();
        }
        // Verificar que aparecen reservas de todos los residentes
        yield expect(page.locator(`text="${testUsers.resident1.name}"`)).toBeVisible();
        yield expect(page.locator(`text="${testReservation.area}"`)).toBeVisible();
        // Filtrar por área común
        const areaFilter = page.locator('select[name="area"], #area-filter').first();
        if (yield areaFilter.isVisible()) {
            yield areaFilter.selectOption(testReservation.area);
            // Verificar filtrado
            yield expect(page.locator(`text="${testReservation.area}"`)).toBeVisible();
        }
        // Ver detalles de una reserva
        const viewDetailsButton = page.locator('button:has-text("Ver"), button:has-text("Detalles")').first();
        if (yield viewDetailsButton.isVisible()) {
            yield viewDetailsButton.click();
            // Verificar información detallada
            yield expect(page.locator(`text="${testReservation.purpose}"`)).toBeVisible();
            yield expect(page.locator(`text="${testReservation.estimatedGuests}"`)).toBeVisible();
        }
    }));
    test('Configuración de tarifas por administrador', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a configuración de áreas comunes
        yield page.locator('a:has-text("Configuración"), a:has-text("Áreas")').first().click();
        // Editar tarifa de un área
        const editAreaButton = page.locator(`text="${testCommonAreas[0].name}"~button:has-text("Editar"), .edit-area`).first();
        if (yield editAreaButton.isVisible()) {
            yield editAreaButton.click();
            // Cambiar tarifa
            const rateInput = page.locator('input[name="hourlyRate"], #hourly-rate').first();
            if (yield rateInput.isVisible()) {
                yield rateInput.clear();
                yield rateInput.fill('90000'); // Nueva tarifa
                // Guardar cambios
                const saveButton = page.locator('button[type="submit"], button:has-text("Guardar")').first();
                yield saveButton.click();
                // Verificar actualización
                yield expect(page.locator('text=/actualizada/i, text=/guardada/i')).toBeVisible();
            }
        }
    }));
    test('Reporte de ocupación de áreas comunes', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a reportes
        yield page.locator('a:has-text("Reportes"), a:has-text("Estadísticas")').first().click();
        // Seleccionar reporte de reservas/ocupación
        const reservationReportTab = page.locator('tab:has-text("Reservas"), button:has-text("Ocupación")').first();
        if (yield reservationReportTab.isVisible()) {
            yield reservationReportTab.click();
        }
        // Configurar período del reporte
        const periodSelect = page.locator('select[name="period"], #report-period').first();
        if (yield periodSelect.isVisible()) {
            yield periodSelect.selectOption('MONTHLY');
        }
        // Generar reporte
        const generateButton = page.locator('button:has-text("Generar"), button:has-text("Crear Reporte")').first();
        if (yield generateButton.isVisible()) {
            yield generateButton.click();
            // Verificar que se muestra el reporte
            yield expect(page.locator('text=/ocupación/i, .chart, .statistics')).toBeVisible();
            // Verificar métricas básicas
            yield expect(page.locator('text=/total.*reservas/i, text=/ingresos/i')).toBeVisible();
        }
    }));
});
